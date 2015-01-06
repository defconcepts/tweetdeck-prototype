var utils = require('../utils');
var TweetColumnItem = require('./tweetcolumnitem');
var _ = require('lodash');

var TWITTER = {
  BASE: 'https://api.twitter.com',
  ENDPOINTS: {
    home: {
      url: '/1.1/statuses/home_timeline.json',
      query: {
        count: 200,
        include_my_retweets: 1,
        include_entities: 1,
        include_cards: 1,
        send_error_codes: 1,
        include_user_entities: 1
      }
    },
    mentions: {
      url: '/1.1/statuses/mentions_timeline.json',
      query: {
        count: 200,
        include_my_retweets: 1,
        include_entities: 1,
        include_cards: 1,
        send_error_codes: 1,
        include_user_entities: 1
      }
    }
  }
};

function Feed(type, account) {
  this.type = type;
  this.account = account;
}

var FeedProto = Feed.prototype;

FeedProto.fetch = function(opts) {
  opts = opts || {};

  var endpoint = TWITTER.ENDPOINTS[this.type];
  var query = _.chain(endpoint.query || {})
    .clone()
    .extend(opts.query || {})
    // Only keep truthy values
    .pick(function (value) {
      return (typeof value !== 'undefined' && value !== null);
    })
    .value();

  var url = TWITTER.BASE + endpoint.url + '?' + utils.objToUrlParams(query);

  return this.account.proxiedRequest(url)
    .then(r => r.json())
    .then(tweets =>
      tweets.map(data =>
        new TweetColumnItem(data)
      )
    );
};

module.exports = Feed;
