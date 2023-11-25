/*jshint esversion:6*/

module.exports = {
  init: (userAuthKey, restAPIKey) => {
    const _userAuthKey = userAuthKey || process.env.ONESIGNAL_USER_AUTH_KEY || null;
    const _restAPIKey = restAPIKey || process.env.ONESIGNAL_REST_API_KEY || null;
    var _appID = process.env.ONESIGNAL_APP_ID || null;
    var message = {};
    const _url = "https://onesignal.com/api/v1/";
    const _requestPromise = require('request-promise');
    if(_userAuthKey === null){
      throw("User Authentication Key is missing");
    }
    if(_restAPIKey === null){
      throw("REST API Key is missing");
    }
    const _notifications = {
      setContent: (contents) => {
        message.contents = contents || {};
        return _notifications;
      },
      setHeadings: (headings) => {
        message.headings = headings || {};
        return _notifications;
      },
      isIOS: (flag) => {
        message.isIos = typeof(flag) === 'undefined' || flag;
        return _notifications;
      },
      isAndroid: (flag) => {
        message.isAndroid = typeof(flag) === 'undefined' || flag;
        return _notifications;
      },
      isWP: (flag) => {
        message.isWP = typeof(flag) === 'undefined' || flag;
        return _notifications;
      },
      isADM: (flag) => {
        message.isADM = typeof(flag) === 'undefined' || flag;
        return _notifications;
      },
      isChrome: (flag) => {
        message.isChrome = typeof(flag) === 'undefined' || flag;
        return _notifications;
      },
      isChromeWeb: (flag) => {
        message.isChromeWeb = typeof(flag) === 'undefined' || flag;
        return _notifications;
      },
      isSafari: (flag) => {
        message.isSafari = typeof(flag) === 'undefined' || flag;
        return _notifications;
      },
      isAnyWeb: (flag) => {
        message.isAnyWeb = typeof(flag) === 'undefined' || flag;
        return _notifications;
      },
      includeSegment: (segments) => {
        if(segments instanceof Array){
          for(var i=0; i<segments.length; i++){
            message.included_segments.push(segments[i]);
          }
        }else{
          message.included_segments.push(segments);
        }
        return _notifications;
      },
      excludeSegment: (segments) => {
        if(segments instanceof Array){
          message.excluded_segments = segments;
        }else{
          message.excluded_segments = message.excluded_segments || [];
          message.excluded_segments.push(segments);
        }
        return _notifications;
      },
      includePlayer: (ids) => {
        if(ids instanceof Array){
          message.include_player_ids = ids;
        }else{
          message.include_player_ids = message.include_player_ids || [];
          message.include_player_ids.push(ids);
        }
        return _notifications;
      },
      includeIOSTokens: (tokens) => {
        if(tokens instanceof Array){
          message.include_ios_tokens = tokens;
        }else{
          message.include_ios_tokens = message.include_ios_tokens || [];
          message.include_ios_tokens.push(tokens);
        }
        return _notifications;
      },
      includeAndroidRegIds: (ids) => {
        if(ids instanceof Array){
          message.include_android_reg_ids = ids;
        }else{
          message.include_android_reg_ids = message.include_android_reg_ids || [];
          message.include_android_reg_ids.push(ids);
        }
        return _notifications;
      },
      includeWPUris: (uris) => {
        if(uris instanceof Array){
          message.include_wp_uris = uris;
        }else{
          message.include_wp_uris = message.include_wp_uris || [];
          message.include_wp_uris.push(uris);
        }
        return _notifications;
      },
      includeWPWNSUris: (uris) => {
        if(uris instanceof Array){
          message.include_wp_wns_uris = uris;
        }else{
          message.include_wp_wns_uris = message.include_wp_wns_uris || [];
          message.include_wp_wns_uris.push(uris);
        }
        return _notifications;
      },
      includeAmazonRegIds: (ids) => {
        if(ids instanceof Array){
          message.include_amazon_reg_ids = ids;
        }else{
          message.include_amazon_reg_ids = message.include_amazon_reg_ids || [];
          message.include_amazon_reg_ids.push(ids);
        }
        return _notifications;
      },
      includeChromeRegIds: (ids) => {
        if(ids instanceof Array){
          message.include_chrome_reg_ids = ids;
        }else{
          message.include_chrome_reg_ids = message.include_chrome_reg_ids || [];
          message.include_chrome_reg_ids.push(ids);
        }
        return _notifications;
      },
      includeChromeWebRegIds: (ids) => {
        if(ids instanceof Array){
          message.include_chrome_web_reg_ids = ids;
        }else{
          message.include_chrome_web_reg_ids = message.include_chrome_web_reg_ids || [];
          message.include_chrome_web_reg_ids.push(ids);
        }
        return _notifications;
      },
      setAppIds: (ids) => {
        if(ids instanceof Array){
          message.app_ids = ids;
        }else{
          message.app_ids = message.app_ids || [];
          message.app_ids.push(ids);
        }
        return _notifications;
      },
      addTags: (tags) => {
        if(tags instanceof Array){
          message.tags = tags;
        }else{
          message.tags = message.tags || [];
          message.tags.push(tags);
        }
        return _notifications;
      },
      iosBadgeType: (type) => {
        switch(type){
          case "None":
          case "SetTo":
          case "Increase":
            message.ios_badgeType = type;
            break;
        }
        return _notifications;
      },
      addData: (data) => {
        message.data = data;
        return _notifications;
      },
      isAndroidBackgroundData: (flag) => {
        message.android_background_data = typeof(flag) === 'undefined' || flag;
        return _notifications;
      },
      isAmazonBackgroundData: (flag) => {
        message.amazon_background_data = typeof(flag) === 'undefined' || flag;
        return _notifications;
      },
      isContentAvailable: (flag) => {
        message.content_available = typeof(flag) === 'undefined' || flag;
        return _notifications;
      },
      setTemplateId: (id) => {
        message.template_id = id || null;
        return _notifications;
      },
      send: () => {
        if(_appID === null){
          throw("App ID is missing");
        }
        const __templaId = message.template_id || null;
        const __androidBgData = message.android_background_data || false;
        const __amazonBgData = message.amazon_background_data || false;
        const __contentAvailable = message.content_available || false;
        const __contents = message.contents || null;
        if(__contents === null && __androidBgData === false && __amazonBgData === false && __contentAvailable === false && __templaId === null){
          throw("Message content is missing");
        }
        message.app_id = _appID;
        const _options = {
          uri: _url + "notifications",
          method: "POST",
          headers: {
            'Authorization': 'Basic ' + _restAPIKey,
            'Content-Type': 'application/json'
          },
          body: message,
          json: true
        };
        return _requestPromise(_options);
      }
    };


    const _apps = {
      all: () => {
        const _options = {
          uri: _url + "apps",
          headers: {
            'Authorization' : 'Basic ' + _userAuthKey
          },
          json: true
        };
        return _requestPromise(_options);
      },
      findOne: function(id){
        const _id = id || null;
        if(_id === null){
          throw("Application ID is missing");
        }
        const _options = {
          uri: _url + "apps/" + _id,
          headers: {
            'Authorization': 'Basic ' + _userAuthKey
          },
          json: true
        };
        return _requestPromise(_options);
      },
      create: function(appObj){
        const flag = appObj || null;
        if(falg === null){
          throw("App Object parameter is missing");
        }
        const _app = {
          apns_env: appObj.apns_env || null,
          apns_p12: appObj.apns_p12 || null,
          apns_p12_password: appObj.apns_p12_password || null,
          gcm_key: appObj.gcm_key || null,
          chrome_key: appObj.chrome_key || null,
          safari_apns_12: appObj.safari_apns_12 || null,
          site_name: appObj.site_name || null,
          safari_site_origin: appObj.safari_site_origin || null,
          safari_icon_16_16: appObj.safari_icon_16_16 || 'public/safari_packages/icons/16x16.png',
          safari_icon_32_32: appObj.safari_icon_32_32 || 'public/safari_packages/icons/16x16@2x.png',
          safari_icon_64_64: appObj.safari_icon_64_64 || 'public/safari_packages/icons/32x32@2x.png',
          safari_icon_128_128: appObj.safari_icon_128_128 || 'public/safari_packages/icons/128x128.png',
          safari_icon_256_256: appObj.safari_icon_256_256 || 'public/safari_packages/icons/128x128@2x.png',
          chrome_web_origin: appObj.chrome_web_origin || null,
          chrome_web_gcm_sender_id: appObj.chrome_web_gcm_sender_id || null,
          chrome_web_sub_domain: appObj.chrome_web_sub_domain || null
        };
        const _options = {
          uri: _url + "apps",
          method: "POST",
          headers: {
            'Authorization': 'Basic ' + _userAuthKey,
            'Content-Type': 'application/json'
          },
          body: _app,
          json: true
        };
        return _requestPromise(options);
      },
      update: function(appObj){
        const flag = appObj || null;
        if(flag === null){
          throw("App Object parameter is missing");
        }
        const _id = appObj.id || null;
        if(_id === null){
          throw("Application ID is missing");
        }
        const _app = {
          apns_env: appObj.apns_env,
          apns_p12: appObj.apns_p12,
          apns_p12_password: appObj.apns_p12_password,
          gcm_key: appObj.gcm_key,
          chrome_key: appObj.chrome_key,
          safari_apns_12: appObj.safari_apns_12,
          site_name: appObj.site_name,
          safari_site_origin: appObj.safari_site_origin,
          safari_icon_16_16: appObj.safari_icon_16_16,
          safari_icon_32_32: appObj.safari_icon_32_32,
          safari_icon_64_64: appObj.safari_icon_64_64,
          safari_icon_128_128: appObj.safari_icon_128_128,
          safari_icon_256_256: appObj.safari_icon_256_256,
          chrome_web_origin: appObj.chrome_web_origin,
          chrome_web_gcm_sender_id: appObj.chrome_web_gcm_sender_id,
          chrome_web_sub_domain: appObj.chrome_web_sub_domain
        };
        const _options = {
          uri: _url + "apps/" + _id,
          method: "PUT",
          headers: {
            'Authorization': 'Basic ' + _userAuthKey,
            'Content-Type': 'application/json'
          },
          body: _app,
          json: true
        };
        return _requestPromise(options);
      }
    };

    const _players = {
      all: function(app_id, limit, offset) {
        const _appId = app_id || null;
        if(_appId === null){
          throw("Application ID is missing");
        }
        const _limit = limit || 300;
        const _offset = offset || 0;
        const _options = {
          uri: _url + "players",
          qs: {
            app_id: _appId,
            limit: _limit,
            offset: _offset
          },
          headers: {
            'Authorization': 'Basic ' + _restAPIKey
          },
          json: true
        };
        return _requestPromise(_options);
      },
      findOne: function(id){
        const _id = id || null;
        if(_id === null){
          throw("Application ID is missing");
        }
        const _options = {
          uri: _url + "players/" + _id,
          headers: {
            'Authorization': 'Basic ' + _restAPIKey
          },
          json: true
        };
        return _requestPromise(_options);
      }
    };

    const _self = {
      reset: () => {
        message = {
          included_segments: ['All']
        };
        return _self;
      },
      setApp: (id) => {
        _appID = id || null;
        return _self;
      },
      apps: _apps,
      notifications: _notifications,
      players: _players
    };
    
    _self.reset();
    return _self;
  }
};
