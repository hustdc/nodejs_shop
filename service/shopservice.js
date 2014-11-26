var Shop = require('../model/shop');
var async = require('async');
var Paging = require('../util/paging');
var Convert = require('../util/convert');
var itemService = require('./itemService');

function findById(shopId, callback) {
    Shop.findOne({where:{id:shopId}}).success(function(data) {
        callback(data.dataValues);
    })
}

exports.findShopsByUserId = function(userId, paging, callback) {
    async.waterfall([
        function(cb) {
            Shop.findAll({where:{user_id:userId}, offset:paging.getSinceCount(), limit:paging.getPageSize()}).success(function(data){
                cb(null, Convert.values2Arr(data));
            });
        }, function(data, cb) {
             Shop.count({where:{user_id:userId}}).success(function(count){
                var pResult = new Paging(count, paging.getPage(), paging.getPageSize(), data);
                cb(null, pResult);
            });
        }
        ], function(err, result) {
            callback(result);
        });

}

exports.add = function(shop, callback) {
    console.log(shop);
    Shop.create(shop).complete(function(err, result) {
        if(err) {
            callback(false);
        } else {
            callback(true);
        }
    })
}

exports.findShopAndIndexItems = function(shopId, p, callback) {
    async.waterfall([
            function(cb) {
                findById(shopId, function(result) {
                    cb(null, result);
                })
            }, function(data, cb) {
                itemService.findItemsByShopId(data.id, p, function(result) {
                    cb(null, {shop:data, items:result});
                })
            }
        ], function(err, result) {
            callback(result);
        });
}

exports.findById = findById