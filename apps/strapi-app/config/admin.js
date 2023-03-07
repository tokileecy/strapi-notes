module.exports = ({ env }) => ({
  apiToken: {
    salt: env('API_TOKEN_SALT', 'ffjwq7wqe9qw9dv2221215707b4e3e7'),
  },
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'HMaaIx1CVpGmlS7DZ6kHdQ=='),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'dN0ku0Dh9FfjlXbFDPOOlg=='),
    },
  },
});
