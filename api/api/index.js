module.exports = (req, res) => {
  res.status(200).json({
    status: 'n8n Vercel Bridge Active',
    endpoints: [
      '/api/n8n',
      '/api/n8n?action=list_workflows'
    ]
  });
};
