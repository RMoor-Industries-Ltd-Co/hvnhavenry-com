#!/bin/bash
# One-time setup for Calculus-Havenry (66.228.57.116)
# Run as root: bash setup-server.sh
set -e

echo "── Installing Docker ────────────────────────────────"
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  > /etc/apt/sources.list.d/docker.list
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "── Installing Certbot ───────────────────────────────"
apt-get install -y certbot

echo "── Cloning repo ─────────────────────────────────────"
mkdir -p /srv/hvnhavenry
cd /srv/hvnhavenry
git clone https://github.com/piaar/hvnhavenry-com.git .

echo "── Issuing SSL cert ─────────────────────────────────"
echo "Make sure hvnhavenry.com DNS A record → 66.228.57.116 before running certbot."
read -p "Press enter once DNS is propagated..."
certbot certonly --standalone \
  -d hvnhavenry.com \
  -d www.hvnhavenry.com \
  --non-interactive --agree-tos -m rmoorindustries@gmail.com

echo "── Creating .env.local ──────────────────────────────"
cp .env.example .env.local
echo "Edit /srv/hvnhavenry/.env.local with your Shopify token now."
read -p "Press enter when done..."

echo "── Cloning HVN Global sibling checkout ──────────────"
# docker-compose.yml's app-global service builds from ../hvnglobalco-com and
# nginx depends_on it, so `docker compose up --build` below fails on a fresh
# host without this sibling checkout + its env file. The GitHub Actions deploy
# workflow provisions both automatically on every push to main using the HVN
# Linode Deploy GitHub App's installation token; this one-time bootstrap uses
# a plain clone instead, relying on whatever git credential already lets the
# clone above (hvnhavenry-com itself) succeed on this host.
git clone https://github.com/RMoor-Industries-Ltd-Co/hvnglobalco-com.git ../hvnglobalco-com
touch .env.global-preview.local
echo "app-global's real GDRIVE_* credentials land in .env.global-preview.local on"
echo "the next CI deploy (deploy.yml upserts them) -- this empty file just lets"
echo "docker compose start now; Drive asset pull will no-op until then."

echo "── Starting containers ──────────────────────────────"
docker compose up -d --build

echo ""
echo "✓ Server setup complete. HVN Havenry is live at https://hvnhavenry.com"
