
# Dev Setup

```Bash
sudo apt update

# Install Code-Server (VSCode in the Cloud) (Optional)
curl -fsSL https://code-server.dev/install.sh | sh

# Install MongoDB
curl -fsSL https://pgp.mongodb.com/server-7.0.asc |sudo gpg  --dearmor -o /etc/apt/trusted.gpg.d/mongodb-server-7.0.gpg
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Allow Nginx through ufw
ufw allow 80
ufw allow 443

# Install npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get update
sudo apt-get install -y nodejs

# Install git
sudo apt-get install -y git screen htop

# Install Certbot and its Nginx plugin
sudo apt install -y certbot python3-certbot-nginx

cat <<EOF > /etc/nginx/sites-enabled/stamps
server {
    listen 80;
    server_name stamps.opensauce.community;

    location / {
        root /stamps/client/build;
        try_files \$uri \$uri/ =404;
    }

    location /api {
        # proxy_pass http://unix:/stamps/stamps.sock;
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

systemctl reload nginx

# Configure SSL for your domain
sudo certbot --nginx -d stamps.opensauce.community

# Install repo
git clone https://github.com/WhiskeyDeltaX/Open-Sauce-Stamps.git
mv Open-Sauce-Stamps /stamps

sudo useradd -m stamps

chown -R stamps:stamps /stamps

sudo -u stamps /bin/bash

cd /stamps/server
mkdir -p ~/.config/pip/
echo "[global]" >> ~/.config/pip/pip.conf
echo "break-system-packages = true" >> ~/.config/pip/pip.conf

pip3 install -r requirements.txt

chmod +x ./run.sh
screen -S server -d -m ./run.sh

cd ../client
npm install
echo "REACT_APP_API_URL=https://stamps.opensauce.community/api/v1" > .env
```
