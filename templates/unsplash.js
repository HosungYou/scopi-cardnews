/**
 * Unsplash image fetcher for cover slides.
 * Uses free-tier API (50 req/hr).
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const DEFAULT_CLIENT_ID = ''; // User must set via config

async function searchPhotos(query, opts = {}) {
  const clientId = opts.clientId || process.env.UNSPLASH_ACCESS_KEY || DEFAULT_CLIENT_ID;
  if (!clientId) {
    console.warn('[unsplash] No API key. Set UNSPLASH_ACCESS_KEY env var or config.unsplash.clientId');
    return [];
  }

  const perPage = opts.perPage || 5;
  const orientation = opts.orientation || 'portrait';
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=${orientation}&client_id=${clientId}`;

  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept-Version': 'v1' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve((json.results || []).map(p => ({
            id: p.id,
            url: p.urls.regular,
            downloadUrl: p.links.download_location,
            author: p.user.name,
            authorUrl: p.user.links.html,
            description: p.description || p.alt_description,
          })));
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function downloadPhoto(photoUrl, outPath) {
  return new Promise((resolve, reject) => {
    const follow = (url) => {
      https.get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return follow(res.headers.location);
        }
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          if (outPath) {
            fs.writeFileSync(outPath, buffer);
            resolve(outPath);
          } else {
            resolve(buffer.toString('base64'));
          }
        });
      }).on('error', reject);
    };
    follow(photoUrl);
  });
}

async function getPhotoBase64(query, opts = {}) {
  const photos = await searchPhotos(query, opts);
  if (!photos.length) return null;
  const photo = photos[opts.index || 0];
  const base64 = await downloadPhoto(photo.url + '&w=1080&h=1350&fit=crop');
  return {
    base64,
    dataUri: `data:image/jpeg;base64,${base64}`,
    attribution: `Photo: ${photo.author} / Unsplash`,
    author: photo.author,
  };
}

module.exports = { searchPhotos, downloadPhoto, getPhotoBase64 };
