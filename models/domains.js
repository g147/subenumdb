var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subdomainSchema = new Schema({
  subdomain: {
    type: String,
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}
}, {
  timestamps: true
});

var domainSchema = new Schema({
  domain: {
    type: String,
    required: true
  },
  subdomains: [subdomainSchema]
}, {
  timestamps: true,
  collection: 'Domains'
});

var Domains = mongoose.model('Domain', domainSchema);

module.exports = Domains;