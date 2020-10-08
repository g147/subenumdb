var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Domains = require('../models/domains');
var Verify    = require('./verify');

var domainRouter = express.Router();
domainRouter.use(bodyParser.json());

domainRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Domains.find({})
        .populate('subdomains.addedBy')
        .exec(function (err, domain) {
        if (err) throw err;
        res.json(domain);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Domains.create(req.body, function (err, domain) {
        if (err) throw err;
        console.log('new domain added');
        var id = domain._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end('domain id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Domains.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

domainRouter.route('/:domainId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Domains.findById(req.params.domainId)
        .populate('subdomains.addedBy')
        .exec(function (err, domain) {
        if (err) throw err;
        res.json(domain);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Domains.findByIdAndUpdate(req.params.domainId, {
        $set: req.body
    }, {
        new: true
    }, function (err, domain) {
        if (err) throw err;
        res.json(domain);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Domains.findByIdAndRemove(req.params.domainId, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

domainRouter.route('/:domainId/subdomains')
.all(Verify.verifyOrdinaryUser)

.get(function (req, res, next) {
    Domains.findById(req.params.domainId)
        .populate('subdomains.addedBy')
        .exec(function (err, domain) {
        if (err) throw err;
        res.json(domain.subdomains);
    });
})

.post(function (req, res, next) {
    Domains.findById(req.params.domainId, function (err, domain) {
        if (err) throw err;
        req.body.addedBy = req.user._id;
        domain.subdomains.push(req.body);
        domain.save(function (err, domain) {
            if (err) throw err;
            console.log('updated subdomain');
            res.json(domain);
        });
    });
})

.delete(Verify.verifyAdmin, function (req, res, next) {
    Domains.findById(req.params.domainId, function (err, domain) {
        if (err) throw err;
        for (var i = (domain.subdomains.length - 1); i >= 0; i--) {
            domain.subdomains.id(domain.subdomains[i]._id).remove();
        }
        domain.save(function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('deleted all subdomains');
        });
    });
});

domainRouter.route('/:domainId/subdomains/:subdomainId')
.all(Verify.verifyOrdinaryUser).get(function (req, res, next) {
    Domains.findById(req.params.domainId)
        .populate('subdomains.addedBy')
        .exec(function (err, domain) {
        if (err) throw err;
        res.json(domain.subdomains.id(req.params.subdomainId));
    });
})

.put(function (req, res, next) {
    Domains.findById(req.params.domainId, function (err, domain) {
        if (err) throw err;
        domain.subdomains.id(req.params.subdomainId).remove();
                req.body.addedBy = req.decoded._doc._id;
        domain.subdomains.push(req.body);
        domain.save(function (err, domain) {
            if (err) throw err;
            console.log('updated subdomain');
            res.json(domain);
        });
    });
})

.delete(function (req, res, next) {
    Domains.findById(req.params.domainId, function (err, domain) {
        if (domain.subdomains.id(req.params.subdomainId).addedBy
           != req.decoded._doc._id) {
            var err = new Error('unauthorized');
            err.status = 403;
            return next(err);
        }
        domain.subdomains.id(req.params.subdomainId).remove();
        domain.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});

module.exports = domainRouter;