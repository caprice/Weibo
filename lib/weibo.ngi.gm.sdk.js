/*
 * 所有Api的基类
 */
$unit.ns("gm.ngi.weibosdk.ApiError");
gm.ngi.weibosdk.ApiError = {
	10023 : "请求次数过于频繁,请稍候再试.",	
	20019 : "请勿重复发布相同内容.",
	20202 : "不合法的评论.",
	21325 : "用户名或密码不正确。",
	21327 : "token过期.",
	10016 : "微博内容不能为空.",
	20008 : "评论内容不能为空.",
	20101 : "此微博已经删除。",
	20207 : "作者只允许可信用户评论"
};

// gm.ngi.weibosdk.BaseApi
// gm.ngi.weibo.
// gm.ngi.weathers.
// gm.ngi.news.
$unit.ns("gm.ngi.weibosdk.BaseApi");
gm.ngi.weibosdk.BaseApi = function() {

	this.async = true;
	this.wb = null;

	// 设置api以同步(false)或异步(true)方式执行
	this.apiAsync = true;

	// 设置api完成执行后的回调函数，参数类型为ApiResult
	this.apiComplete = null;

	this.apiConnectionError = null;

	this.apiServerError = null;
};

/*
 * 执行微博API url: Api 地址 params: 查询参数 postData: 表单数据
 */
gm.ngi.weibosdk.BaseApi.prototype.exec = function(url, params, postdata) {

	if (!params) {
		params = {};
	}
	params.traceCode = this.wb.traceCode;
	url = url + "?" + $.param(params);

	$.ajax({
		async : this.apiAsync,
		timeout: this.wb.ajaxTimeout,
		beforeSend : function(xhr) {
			// attach oauth token
			xhr.setRequestHeader("Authorization", "OAuth2 "
					+ this.wb.credential.accessToken);
		},
		context : this,
		dataType : "json",
		url : url,
		success : function(data, status, xhr) {
			var result = new gm.ngi.weibosdk.ApiResult();
			result.succeeded = true;
			result.data = data;
			result.xhr = xhr;
			if (this.apiComplete) {
				this.apiComplete(result);
			}
		},
		error : function(xhr, message, exception) {
			var result = new gm.ngi.weibosdk.ApiResult();
			result.succeeded = false;
			result.errorMessage = message;
			result.exception = exception;
			result.xhr = xhr;
			try {
				result.data = JSON.parse(xhr.responseText);
			} catch (err) {
			}
			if (this.apiComplete) {
				this.apiComplete(result);
			}
			if (xhr.readyState < 4 && this.apiConnectionError) {
				this.apiConnectionError(result);

			} else if (xhr.readyState >= 4 && this.apiServerError) {
				this.apiServerError(result);

			}

		},
		data : postdata,
		type : postdata ? "POST" : "GET"
	});
};

gm.ngi.weibosdk.BaseApi.prototype.className = "BaseApi";
/*
 * 微博 Comment Api 类
 */
$unit.ns("gm.ngi.weibosdk.CommentApi");
gm.ngi.weibosdk.CommentApi = function(wb) {
	this.wb = wb;
};
gm.ngi.weibosdk.CommentApi.prototype = new gm.ngi.weibosdk.BaseApi();
gm.ngi.weibosdk.CommentApi.prototype.className = "CommentApi";

/*
 * 根据微博ID返回某条微博的评论列表 doc: http://open.weibo.com/wiki/2/comments/show
 */
gm.ngi.weibosdk.CommentApi.prototype.show = function(id, param) {
	if (!param) {
		param = {};
	}
	param.id = id;
	var url = "https://api.weibo.com/2/comments/show.json";
	this.exec(url, param);
};
/*
 * 获取当前登录用户所发出的评论列表 doc: http://open.weibo.com/wiki/2/comments/by_me
 */
gm.ngi.weibosdk.CommentApi.prototype.by_me = function(since_id, max_id, count,
		page, filter_by_source) {
	var url = "https://api.weibo.com/2/comments/by_me.json";
	this.exec(url, {
		since_id : since_id,
		max_id : max_id,
		count : count,
		page : page,
		filter_by_source : filter_by_source
	});
};
/*
 * 获取当前登录用户所发出的评论列表 doc: http://open.weibo.com/wiki/2/comments/by_me
 */
gm.ngi.weibosdk.CommentApi.prototype.by_me_default = function() {
	return this.by_me(0, 0, 50, 1, 0);
};
/*
 * 获取当前登录用户所接收到的评论列表 doc: http://open.weibo.com/wiki/2/comments/to_me
 */
gm.ngi.weibosdk.CommentApi.prototype.to_me = function(param) {
	var url = "https://api.weibo.com/2/comments/to_me.json";
	this.exec(url, param);
};
/*
 * 获取当前登录用户的最新评论包括接收到的与发出的 doc: http://open.weibo.com/wiki/2/comments/timeline
 */
gm.ngi.weibosdk.CommentApi.prototype.timeline = function(since_id, max_id,
		count, page) {
	var url = "https://api.weibo.com/2/comments/timeline.json";
	this.exec(url, {
		since_id : since_id,
		max_id : max_id,
		count : count,
		page : page
	});
};
/*
 * 获取当前登录用户的最新评论包括接收到的与发出的 doc: http://open.weibo.com/wiki/2/comments/timeline
 */
gm.ngi.weibosdk.CommentApi.prototype.timeline_default = function() {
	return this.timeline(0, 0, 50, 1);
};
/*
 * 获取最新的提到当前登录用户的评论，即@我的评论 doc: http://open.weibo.com/wiki/2/comments/mentions
 */
gm.ngi.weibosdk.CommentApi.prototype.mentions = function(since_id, max_id,
		count, page, filter_by_author, filter_by_source) {
	var url = "https://api.weibo.com/2/comments/mentions.json";
	this.exec(url, {
		since_id : since_id,
		max_id : max_id,
		count : count,
		page : page,
		filter_by_author : filter_by_author,
		filter_by_source : filter_by_source
	});
};
/*
 * 获取最新的提到当前登录用户的评论，即@我的评论 doc: http://open.weibo.com/wiki/2/comments/mentions
 */
gm.ngi.weibosdk.CommentApi.prototype.mentions_default = function() {
	return this.mentions(0, 0, 50, 1, 0, 0);
};
/*
 * 根据评论ID批量返回评论信息 doc: http://open.weibo.com/wiki/2/comments/show_batch
 */
gm.ngi.weibosdk.CommentApi.prototype.show_batch = function(cids) {
	var url = "https://api.weibo.com/2/comments/show_batch.json";
	this.exec(url, {
		cids : cids
	});
};

/*
 * 对一条微博进行评论 doc: http://open.weibo.com/wiki/2/comments/create
 */
gm.ngi.weibosdk.CommentApi.prototype.create = function(comment, id, comment_ori) {
	var url = "https://api.weibo.com/2/comments/create.json";
	this.exec(url, null, {
		// comment : encodeURIComponent(comment),
		comment : comment,
		id : id,
		comment_ori : comment_ori
	});
};
/*
 * 对一条微博进行评论 doc: http://open.weibo.com/wiki/2/comments/create
 */
gm.ngi.weibosdk.CommentApi.prototype.create_default = function(comment, id) {
	return this.create(comment, id, 0);
};
/*
 * 删除一条评论 doc: http://open.weibo.com/wiki/2/comments/destroy
 */
gm.ngi.weibosdk.CommentApi.prototype.destroy = function(cid) {
	var url = "https://api.weibo.com/2/comments/destroy.json";
	this.exec(url, null, {
		cid : cid
	});
};
/*
 * 据评论ID批量删除评论 doc: http://open.weibo.com/wiki/2/comments/destroy_batch
 */
gm.ngi.weibosdk.CommentApi.prototype.destroy_batch = function(ids) {
	var url = "https://api.weibo.com/2/comments/destroy_batch.json";
	this.exec(url, null, {
		ids : ids
	});
};
/*
 * 回复一条评论 doc: http://open.weibo.com/wiki/2/comments/reply
 */
gm.ngi.weibosdk.CommentApi.prototype.reply = function(cid, id, comment,
		without_mention, comment_ori) {
	var url = "https://api.weibo.com/2/comments/reply.json";
	this.exec(url, null, {
		cid : cid,
		id : id,
		// comment : encodeURIComponent(comment),
		comment : comment,
		without_mention : without_mention,
		comment_ori : comment_ori
	});
};
/*
 * 回复一条评论 doc: http://open.weibo.com/wiki/2/comments/reply
 */
gm.ngi.weibosdk.CommentApi.prototype.reply_default = function(cid, id, comment) {
	return this.reply(cid, id, comment, 0, 0);
};
/*
 * 微博 GeoApi Api 类
 */
$unit.ns("gm.ngi.weibosdk.GeoApi");
gm.ngi.weibosdk.GeoApi = function(wb) {
	this.wb = wb;
};

gm.ngi.weibosdk.GeoApi.prototype = new gm.ngi.weibosdk.BaseApi();
gm.ngi.weibosdk.GeoApi.prototype.className = "GeoApi";

/* 对apitest接口测试类 */
gm.ngi.weibosdk.GeoApi.prototype.test = function(obj) {
	return this.geo_to_address(obj.id);
};

/*
 * 获取附近地点  doc: http://open.weibo.com/wiki/2/place/nearby/pois
 * long:经度，有效范围：-180.0到+180.0，+表示东经。
 * lat:纬度，有效范围：-90.0到+90.0，+表示北纬。 
 */
gm.ngi.weibosdk.GeoApi.prototype.pois = function(long,lat) {
	var url = "https://api.weibo.com/2/place/nearby/pois.json";
	this.exec(url, {
		lat : lat,
		long:long
	});
};
/*
 * 签到同时可以上传一张图片  doc: http://open.weibo.com/wiki/2/place/pois/add_checkin
 * poiid:需要签到的POI地点ID。 
 * status:签到时发布的动态内容，必须做URLencode，内容不超过140个汉字。
 */
gm.ngi.weibosdk.GeoApi.prototype.add_checkin = function(poiid,status) {
	var url = "https://api.weibo.com/2/place/pois/add_checkin.json";
	var postdata = {
			poiid : poiid,
			status : status
		};
	this.exec(url, null,postdata);
};
/*
 * 根据IP地址返回地理信息坐标 doc: http://open.weibo.com/wiki/2/location/geo/ip_to_geo
 */
gm.ngi.weibosdk.GeoApi.prototype.ip_to_geo = function(ip) {
	var url = "https://api.weibo.com/2/location/geo/ip_to_geo.json";
	this.exec(url, {
		ip : ip
	});
};
/*
 * 根据实际地址返回地理信息坐标 doc: http://open.weibo.com/wiki/2/location/geo/address_to_geo
 */
gm.ngi.weibosdk.GeoApi.prototype.address_to_geo = function(address) {
	var url = "https://api.weibo.com/2/location/geo/address_to_geo.json";
	this.exec(url, {
		address : encodeURIComponent(address)
	});
};
/*
 * 根据地理信息坐标返回实际地址: http://open.weibo.com/wiki/2/location/geo/geo_to_address
 */
gm.ngi.weibosdk.GeoApi.prototype.geo_to_address = function(coordinate) {
	var url = "https://api.weibo.com/2/location/geo/geo_to_address.json";
	this.exec(url, {
		coordinate : coordinate
	});
};
/*
 * 根据GPS坐标获取偏移后的坐标 doc: http://open.weibo.com/wiki/2/location/geo/gps_to_offset
 */
gm.ngi.weibosdk.GeoApi.prototype.gps_to_offset = function(coordinate) {
	var url = "https://api.weibo.com/2/location/geo/gps_to_offset.json";
	this.exec(url, {
		coordinate : coordinate
	});
};
/*
 * 生成一张静态的地图图片 doc: http://open.weibo.com/wiki/2/location/base/get_map_image
 */
gm.ngi.weibosdk.GeoApi.prototype.get_map_image = function(center_coordinate,
		city, coordinates, names, offset_x, offset_y, font, lines, polygons,
		size, format, zoom, scale, traffic) {
	var url = "https://api.weibo.com/2/location/base/get_map_image.json";
	this.exec(url, {
		center_coordinate : center_coordinate,
		city : city,
		coordinates : coordinates,
		names : names,
		offset_x : offset_x,
		offset_y : offset_y,
		font : font,
		lines : lines,
		polygons : polygons,
		size : size,
		format : format,
		zoom : zoom,
		scale : scale,
		traffic : traffic
	});
	/*
	 * 生成一张静态的地图图片 doc: http://open.weibo.com/wiki/2/location/base/get_map_image
	 */
	gm.ngi.weibosdk.GeoApi.prototype.get_map_image_default = function() {
		var url = "https://api.weibo.com/2/location/base/get_map_image.json";
		this.exec(url);
	};

};
/*
 * 微博 User Api 类
 */
$unit.ns("gm.ngi.weibosdk.NewsApi");
gm.ngi.weibosdk.NewsApi = {
	className : "NewsApi",
	lnk : "http://api.sina.com.cn",
	config : {
		ie : 'utf-8',
		oe : 'utf-8',
		datetime : '2012-02-29%2016:43:43',
		method : 'sina.news.list.get',
		app_key : '39e8547b-078b-85cb-399c-5c92-111e6e40',
		format : 'json',
		channel : 1,
		ch_map : '',
		column : 94,
		comp_h : '',
		comp_w : '',
		date : '',
		delay : 0,
		k : '',
		num : 60,
		offset_num : '',
		offset_page : '',
		page : 1,
		pid : '',
		stime : '',
		type : 1,
		ver : '1.0',
		video : 0,
		traceCode : 0
	},

	/*
	 * 获取新闻：头条
	 */
	getTop : function(pIndex, pSize, nowTime, callback) {
		this.config.method = "sina.news.list.important";
		this.config.column = gm.ngi.weibosdk.NewsType.Top;
		this.config.page = pIndex || 1;
		this.config.num = pSize || 10;
		this.config.datetime = this.getNowTimeString(nowTime);
		this.exec(callback);
	},
	/*
	 * 获取新闻 newsType:gm.ngi.weibosdk.NewsType
	 */
	getNews : function(newsType, pIndex, pSize, nowTime, callback) {
		this.config.column = newsType;
		this.config.page = pIndex || 1;
		this.config.num = pSize || 10;
		this.config.datetime = this.getNowTimeString(nowTime);
		this.exec(callback);
	},
	getNowTimeString : function(d) {
		var date = d || new Date();
		return $unit.format("{0}-{1}-{2} {3}:{4}:{5}", date.getFullYear(), date
				.getMonth() + 1, date.getDate(), date.getHours(), date
				.getMinutes(), date.getSeconds());
	},
	exec : function(callback) {
		this.config.traceCode = Math.random();
		var url = this.lnk + "?" + $.param(this.config);
		$.ajax({
			async : true,
			dataType : "json",
			url : url,
			success : function(data, status, xhr) {
				var result = new gm.ngi.weibosdk.ApiResult();
				result.succeeded = true;
				result.data = data;
				result.xhr = xhr;
				if (callback) {
					callback(result);
				}
			},
			error : function(xhr, message, exception) {
				var result = new gm.ngi.weibosdk.ApiResult();
				result.succeeded = false;
				result.errorMessage = message;
				result.exception = exception;
				result.xhr = xhr;
				try {
					result.data = JSON.parse(xhr.responseText);
				} catch (err) {
				}
				if (callback) {
					callback(result);
				}
			},
			type : "GET"
		});
	}
};
$unit.ns("gm.ngi.weibosdk.NewsType");
/*
 * 新闻类别
 */
gm.ngi.weibosdk.NewsType = {
	// 头条
	Top : 89,
	// 国内
	China : 90,
	// 国际
	World : 91,
	// 社会
	Life : 92,
	// 军事
	Politics : 93,
	// 体育
	Sports : 94,
	// 娱乐
	Entertainment : 95,
	// 技术
	Technology : 96,
	// 财经
	Finance : 97
};
/*
 * 微博 RelationApi Api 类 ErroCode: http://open.weibo.com/wiki/Error_code
 */
$unit.ns("gm.ngi.weibosdk.RelationApi");

gm.ngi.weibosdk.RelationApi = function(wb) {
	this.wb = wb;
};

gm.ngi.weibosdk.RelationApi.prototype = new gm.ngi.weibosdk.BaseApi();

(function(b) {
	var lnk = "https://api.weibo.com/2/friendships/";
	b.className = "RelationApi";
	/*
	 * 获取用户的关注列表 http://open.weibo.com/wiki/2/friendships/friends uid int64
	 * 需要查询的用户UID。 screen_name string 需要查询的用户昵称。 count int
	 * 单页返回的记录条数，默认为50，最大不超过200。 cursor int
	 * 返回结果的游标，下一页用返回值里的next_cursor，上一页用previous_cursor，默认为0。
	 */
	b.friends = function(params) {
		var url = lnk + "friends.json";
		this.exec(url, params);
	};

	/*
	 * 获取用户关注对象UID列表 http://open.weibo.com/wiki/2/friendships/friends/ids uid
	 * int64 需要查询的用户UID。 screen_name string 需要查询的用户昵称。 count int
	 * 单页返回的记录条数，默认为50，最大不超过200。 cursor int
	 * 返回结果的游标，下一页用返回值里的next_cursor，上一页用previous_cursor，默认为0。
	 */
	b.friendsIds = function(p) {
		var url = lnk + "friends/ids.json";
		this.exec(url, {
			uid : p.uid,
			count : p.count || 10,
			cursor : p.cursor || 0
		});
	};

	/*
	 * 获取两个用户之间的共同关注人列表
	 * http://open.weibo.com/wiki/2/friendships/friends/in_common uid true int64
	 * 需要获取共同关注关系的用户UID。 suid false int64 需要获取共同关注关系的用户UID，默认为当前登录用户。 count
	 * false int 单页返回的记录条数，默认为50。 page false int 返回结果的页码，默认为1。
	 */
	b.in_common = function(p) {
		var url = lnk + "friends/in_common.json";
		this.exec(url, {
			uid : p.uid,
			suid : p.suid,
			count : p.count || 10,
			page : p.page || 1
		});
	};

	/*
	 * 获取用户的双向关注列表，即互粉列表
	 * http://open.weibo.com/wiki/2/friendships/friends/bilateral uid true int64
	 * 需要获取双向关注列表的用户UID。 count false int 单页返回的记录条数，默认为50。 page false int
	 * 返回结果的页码，默认为1。 sort false int 排序类型，0：按关注时间最近排序，默认为0。
	 */
	b.bilateral = function(p) {
		var url = lnk + "friends/bilateral.json";
		this.exec(url, {
			uid : p.uid,
			count : p.count || 50,
			sort : p.sort || 0,
			page : p.page || 1
		});
	};

	/*
	 * 获取用户双向关注的用户ID列表，即互粉UID列表
	 * http://open.weibo.com/wiki/2/friendships/friends/bilateral/ids uid true
	 * int64 需要获取双向关注列表的用户UID。 count false int 单页返回的记录条数，默认为50，最大不超过2000。 page
	 * false int 返回结果的页码，默认为1。 sort false int 排序类型，0：按关注时间最近排序，默认为0。
	 */
	b.bilateralIds = function(p) {
		var url = lnk + "friends/bilateral/ids.json";
		this.exec(url, {
			uid : p.uid,
			count : p.count || 50,
			sort : p.sort || 0,
			page : p.page || 1
		});
	};

	/*
	 * 获取用户的粉丝列表 http://open.weibo.com/wiki/2/friendships/followers uid false
	 * int64 需要查询的用户UID。 screen_name false string 需要查询的用户昵称。 count false int
	 * 单页返回的记录条数，默认为50，最大不超过200。 cursor false int
	 * 返回结果的游标，下一页用返回值里的next_cursor，上一页用previous_cursor，默认为0。
	 */
	b.followers = function(p) {
		var url = lnk + "followers.json";
		this.exec(url, {
			uid : p.uid,
			count : p.count || 50,
			cursor : p.cursor || 0
		});
	};

	/*
	 * 获取用户粉丝的用户UID列表 http://open.weibo.com/wiki/2/friendships/followers/ids uid
	 * false int64 需要查询的用户UID。 screen_name false string 需要查询的用户昵称。 count false
	 * int 单页返回的记录条数，默认为50，最大不超过200。 cursor false int
	 * 返回结果的游标，下一页用返回值里的next_cursor，上一页用previous_cursor，默认为0。
	 */
	b.followersIds = function(p) {
		var url = lnk + "followers/ids.json";
		this.exec(url, {
			uid : p.uid,
			count : p.count || 50,
			cursor : p.cursor || 0
		});
	};

	/*
	 * 获取用户优质粉丝列表 http://open.weibo.com/wiki/2/friendships/followers/active uid
	 * true int64 需要查询的用户UID。 count false int 返回的记录条数，默认为20，最大不超过200。
	 */
	b.active = function(p) {
		var url = lnk + "followers/active.json";
		this.exec(url, {
			uid : p.uid,
			count : p.count || 20
		});
	};

	/*
	 * 获取当前登录用户的关注人中又关注了指定用户的用户列表
	 * http://open.weibo.com/wiki/2/friendships/friends_chain/followers uid true
	 * int64 指定的关注目标用户UID。 count false int 单页返回的记录条数，默认为50。 page false int
	 * 返回结果的页码，默认为1。
	 */
	b.friends_chainfollowers = function(p) {
		var url = lnk + "friends_chain/followers.json";
		this.exec(url, {
			uid : p.uid,
			count : p.count || 50,
			page : p.page || 1
		});
	};

	/*
	 * 获取两个用户之间的详细关注关系情况 http://open.weibo.com/wiki/2/friendships/show source_id
	 * false int64 源用户的UID。 source_screen_name false string 源用户的微博昵称。 target_id
	 * false int64 目标用户的UID。 target_screen_name false string 目标用户的微博昵称。
	 */
	b.show = function(p) {
		var url = lnk + "show.json";
		this.exec(url, {
			source_id : p.source_id,
			target_id : p.target_id
		});
	};

	/*
	 * 关注一个用户 http://open.weibo.com/wiki/2/friendships/create uid false int64
	 * 需要关注的用户ID。 screen_name false string 需要关注的用户昵称。
	 */
	b.create = function(p) {
		var url = lnk + "create.json";
		this.exec(url, '', {
			uid : p.uid,
			screen_name : p.screen_name
		});
	};

	/*
	 * 取消关注一个用户 http://open.weibo.com/wiki/2/friendships/destroy uid false int64
	 * 需要关注的用户ID。 screen_name false string 需要关注的用户昵称。
	 */
	b.destroy = function(p) {
		var url = lnk + "destroy.json";
		this.exec(url, '', {
			uid : p.uid,
			screen_name : p.screen_name
		});
	};

	/*
	 * 更新当前登录用户所关注的某个好友的备注信息
	 * https://api.weibo.com/2/friendships/remark/update.json uid true int64
	 * 需要修改备注信息的用户UID。 remark true string 备注信息，需要URLencode。
	 */
	b.updateRemark = function(p) {
		var url = lnk + "remark/update.json";
		this.exec(url, '', {
			uid : p.uid,
			remark : encodeURIComponent(p.remark)
		});
	};

	/*
	 * 获取当前登录用户的好友分组列表 http://open.weibo.com/wiki/2/friendships/groups
	 */
	b.groups = function() {
		var url = "https://api.weibo.com/2/friendships/groups.json";
		this.exec(url);
	};

})(gm.ngi.weibosdk.RelationApi.prototype);
/*
 * 微博 Status Api 类
 */
$unit.ns("gm.ngi.weibosdk.StatusApi");
gm.ngi.weibosdk.StatusApi = function(wb) {
	this.wb = wb;
};

gm.ngi.weibosdk.StatusApi.prototype = new gm.ngi.weibosdk.BaseApi();
gm.ngi.weibosdk.StatusApi.prototype.className = "StatusApi";

/*
 * 获取最新的公共微博 api doc: http://open.weibo.com/wiki/2/statuses/public_timeline
 */
gm.ngi.weibosdk.StatusApi.prototype.public_timeline = function(param) {
	var url = "https://api.weibo.com/2/statuses/public_timeline.json";
	this.exec(url, param);
};

/*
 * 获取当前登录用户及其所关注用户的最新微博 api doc:
 * http://open.weibo.com/wiki/2/statuses/friends_timeline
 */
gm.ngi.weibosdk.StatusApi.prototype.friends_timeline = function(param) {
	var url = "https://api.weibo.com/2/statuses/friends_timeline.json";
	this.exec(url, param);
};

/*
 * 获取双向关注用户的最新微博 api doc:
 * http://open.weibo.com/wiki/2/statuses/bilateral_timeline
 */
gm.ngi.weibosdk.StatusApi.prototype.bilateral_timeline = function(param) {
	var url = "https://api.weibo.com/2/statuses/bilateral_timeline.json";
	this.exec(url, param);
};

/*
 * 获取@当前用户的最新微博 api doc: http://open.weibo.com/wiki/2/statuses/mentions
 */
gm.ngi.weibosdk.StatusApi.prototype.mentions = function(param) {
	var url = "https://api.weibo.com/2/statuses/mentions.json";
	this.exec(url, param);
};

/*
 * 获取某一好友分组的微博列表 http://open.weibo.com/wiki/2/friendships/groups/timeline
 */
gm.ngi.weibosdk.StatusApi.prototype.group_timeline = function(param, groupid) {
	if (!param) {
		param = {};
	}
	param.list_id = groupid;
	var url = "https://api.weibo.com/2/friendships/groups/timeline.json";
	this.exec(url, param);
};

/*
 * 获取用户发布的微博 api doc: http://open.weibo.com/wiki/2/statuses/user_timeline
 */
gm.ngi.weibosdk.StatusApi.prototype.user_timeline = function(uid, param,
		trim_user) {
	if (!param) {
		param = {};
	}
	param.uid = uid;
	if (trim_user) {
		param.trim_user = trim_user;
	}
	var url = "https://api.weibo.com/2/statuses/user_timeline.json";
	this.exec(url, param);
};

/*
 * 获取周边微博 api doc: https://api.weibo.com/2/place/nearby_timeline.json
 */
gm.ngi.weibosdk.StatusApi.prototype.nearby_timeline = function(param) {

	var url = "https://api.weibo.com/2/place/nearby_timeline.json";
	this.exec(url, param);
};

/*
 * 获取当前用户最新转发的微博列表 api doc: http://open.weibo.com/wiki/2/statuses/repost_by_me
 */
gm.ngi.weibosdk.StatusApi.prototype.repost_by_me = function(param) {
	var url = "https://api.weibo.com/2/statuses/repost_by_me.json";
	this.exec(url, param);
};
/*
 * 对当前登录用户某一种消息未读数进行清零  api doc: http://open.weibo.com/wiki/2/remind/set_count
 * type :status：新微博数、follower：新粉丝数、cmt：新评论数、dm：新私信数、mention_status：新提及我的微博数、mention_cmt：新提及我的评论数
 */
gm.ngi.weibosdk.StatusApi.prototype.set_count = function(param) {
	var url = "https://api.weibo.com/2/remind/set_count.json";
	this.exec(url, null,param);
};
/*
 * 根据微博ID获取单条微博内容 api doc: http://open.weibo.com/wiki/2/statuses/show
 */
gm.ngi.weibosdk.StatusApi.prototype.show = function(id) {
	var param = {
		id : id
	};
	var url = "https://api.weibo.com/2/statuses/show.json";
	this.exec(url, param);
};

/*
 * 获取微博官方表情的详细信息 api doc: http://open.weibo.com/wiki/2/emotions type:
 * 可选，表情类别，face：普通表情、ani：魔法表情、cartoon：动漫表情，默认为face
 */
gm.ngi.weibosdk.StatusApi.prototype.emotions = function(type) {
	var param = (type) ? {
		type : type
	} : null;
	var url = "https://api.weibo.com/2/emotions.json";
	this.exec(url, param);
};

/*
 * 发布一条新微博 api doc: http://open.weibo.com/wiki/2/statuses/update
 */
gm.ngi.weibosdk.StatusApi.prototype.update = function(status, lat, long,
		annotations) {
	var postdata = {
		status : status
	};
	if (lat && long) {
		postdata.lat = lat;
		postdata.long = long;
	}
	if (annotations) {
		postdata.annotations = annotations;
	}
	var url = "https://api.weibo.com/2/statuses/update.json";
	this.exec(url, null, postdata);
};

/*
 * 转发一条微博 api doc: http://open.weibo.com/wiki/2/statuses/repost options:
 * 是否在转发的同时发表评论，0：否、1：评论给当前微博、2：评论给原微博、3：都评论，默认为0 。
 */
gm.ngi.weibosdk.StatusApi.prototype.repost = function(id, status, options) {
	var postdata = {
		id : id
	};
	if (status) {
		postdata.status = status;
	}
	if (options) {
		postdata.is_comment = options;
	}
	var url = "https://api.weibo.com/2/statuses/repost.json";
	this.exec(url, null, postdata);
};

/*
 * 根据微博ID删除指定微博 api doc: http://open.weibo.com/wiki/2/statuses/destroy
 */
gm.ngi.weibosdk.StatusApi.prototype.destroy = function(id) {
	var postdata = {
		id : id
	};
	var url = "https://api.weibo.com/2/statuses/destroy.json";
	this.exec(url, null, postdata);
};/*
	 * 微博 User Api 类
	 */
$unit.ns("gm.ngi.weibosdk.UserApi");
gm.ngi.weibosdk.UserApi = function(wb) {
	this.wb = wb;
};

gm.ngi.weibosdk.UserApi.prototype = new gm.ngi.weibosdk.BaseApi();
(function(b) {
	b.className = "UserApi";
	var lnk = "https://api.weibo.com/2/";
	/*
	 * 获取用户信息 api http://open.weibo.com/wiki/2/users/show
	 */
	b.show = function(uid) {
		var url = lnk + "users/show.json";
		this.exec(url, {
			uid : uid
		});
	};

	/*
	 * 获取当前用户UID api doc: http://open.weibo.com/wiki/2/account/get_uid
	 */
	b.get_uid = function(uid) {
		var url = lnk + "account/get_uid.json";
		this.exec(url);
	};

	/*
	 * 通过个性化域名获取用户资料以及用户最新的一条微博 URL
	 * https://api.weibo.com/2/users/domain_show.json
	 */
	b.domain_show = function(domainName) {
		var url = lnk + "users/domain_show.json";
		this.exec(url, {
			domain : domainName
		});
	};

	/*
	 * 批量获取用户的粉丝数、关注数、微博数 URL https://api.weibo.com/2/users/counts.json
	 */
	b.counts = function(uids) {
		var url = lnk + "users/counts.json";
		this.exec(url, {
			uids : uids
		});
	};
	// 获取某个用户的各种消息未读数
	b.unread_count = function(uid) {
		// var url = "http://rm.api.weibo.com/2/remind/unread_count.json";
		// 官网是这个接口，但这个接口还不能用，新浪论坛
		// 总版主在5楼时说建议用以下这个，论坛页面：http://forum.open.weibo.com/read.php?tid=16779
		var url = lnk + "remind/unread_count.json";
		this.exec(url, {
			uid : uid
		});
	};
	// 搜索用户时的联想搜索建议
	// https://api.weibo.com/2/search/suggestions/at_users.json
	b.suggestUsers = function(c, total) {
		var url = lnk + "search/suggestions/at_users.json";
		total = total || 20;
		this.exec(url, {
			q : c,
			count : total,
			type : 0
		});
	}

})(gm.ngi.weibosdk.UserApi.prototype);

/*
 * require: 1. jquery-1.7.1.js
 */

/*
 * 新浪微博API文档：http://open.weibo.com/wiki/API%E6%96%87%E6%A1%A3_V2
 */

/*
 * 用户凭据类
 */
$unit.ns("gm.ngi.weibosdk.Credential");
gm.ngi.weibosdk.Credential = function(obj) {
	this.loginName = null;
	this.password = null;
	this.accessToken = null;
	this.expiresAt = null;
	this.userid = null;

	if (obj && typeof obj == "object") {
		this.loginName = obj.loginName;
		this.password = obj.password;
		this.accessToken = obj.accessToken;
		this.expiresAt = new Date(obj.expiresAt); // 从文本反序列化Credential时，obj.expiresAt是string类型
		this.userid = obj.userid;
	}

};
gm.ngi.weibosdk.Credential.prototype.className = "Credential";

/*
 * 判断token是否已过期
 */
gm.ngi.weibosdk.Credential.prototype.expired = function(now) {
	if (!this.accessToken) {
		return true;
	}
	if (!now) {
		now = new Date();
	}
	return this.expiresAt < now;
};

/*
 * 封装微博API的执行结果
 */
$unit.ns("gm.ngi.weibosdk.ApiResult");
gm.ngi.weibosdk.ApiResult = function() {

	// 标识Api是否成功执行
	this.succeeded = false;

	// 标识Api的返回数据。如果succeeded = false, 则data为error object
	// error object 的结构示意如下：
	// {
	// "error":"unsupported_response_type",
	// "error_code":21329
	// "error_description":"不支持的 ResponseType."
	// }
	//
	this.data = null;

	// jquery ajax 执行失败时的错误消息
	this.errorMessage = null;

	// jquery ajax 执行失败时的异常信息
	this.exception = null;

	// xmlhttprequest
	this.xhr = null;
};
gm.ngi.weibosdk.ApiResult.prototype.className = "ApiResult";

/*
 * 翻页
 */
Pager = function(first, total, pageNo, pageSize) {
	this.first = (first) ? first : 0;
	this.total = total;
	this.pageSize = (pageSize) ? pageSize : 10;
	this.pageNo = (pageNo) ? pageNo : 0;
	this.maxPageNo = Math.ceil(this.total / this.pageSize);
};
Pager.prototype.className = "Pager";

Pager.prototype.toParam = function() {
	return {
		count : this.pageSize,
		page : this.pageNo,
		max_id : this.first
	};
};

Pager.prototype.nextPageParam = function() {
	this.pageNo = this.pageNo + 1;
	return this.toParam();
};

/*
 * 微博功能类
 */
$unit.ns("gm.ngi.weibosdk.Weibo");
gm.ngi.weibosdk.Weibo = function() {

	// weibo appid/appkey/clientid
	this.appId = "152710247";

	// weibo app secret
	this.appSecret = "d755508adb262d4e02abd7edbf61879d";

	// 新浪跟踪该应用的代码
	this.traceCode = "12345";

	// 当前用户凭据
	this.credential = new gm.ngi.weibosdk.Credential(); // should be null, just
	// for code hint in
	// ide.

	if (gm.ngi.weibosdk.UserApi)
		this.iUser = new gm.ngi.weibosdk.UserApi(this);
	if (gm.ngi.weibosdk.StatusApi)
		this.iStatus = new gm.ngi.weibosdk.StatusApi(this);
	if (gm.ngi.weibosdk.CommentApi)
		this.iComment = new gm.ngi.weibosdk.CommentApi(this);
	if (gm.ngi.weibosdk.RelationApi)
		this.iRelation = new gm.ngi.weibosdk.RelationApi(this);
	if (gm.ngi.weibosdk.GeoApi)
		this.iGeo = new gm.ngi.weibosdk.GeoApi(this);
	if (gm.ngi.weibosdk.NewsApi)
		this.iNews = gm.ngi.weibosdk.NewsApi;

	this.apiConnectionError = null;

	this.apiServerError = null;
	
	// api 请求超时，默认为60秒
	this.ajaxTimeout = 10000;

	this.init();
};
gm.ngi.weibosdk.Weibo.prototype.className = "Weibo";

gm.ngi.weibosdk.Weibo.prototype.init = function() {

};

/*
 * 登录微博，获取oauth access token
 */
gm.ngi.weibosdk.Weibo.prototype.login = function(loginName, password, callback) {
	var url = "https://api.weibo.com/oauth2/access_token";
	var param = {
		client_id : this.appId,
		client_secret : this.appSecret,
		grant_type : "password",
		username : loginName,
		password : password
	};
	url = url + "?" + $.param(param);
	appendLog("api内部 访问地址："+url);
	$.ajax({
		async : true,
		context : this,
		url : url,
		dataType : "text",
		type : "POST",
		success : function(data, status, xhr) {
			appendLog("api内部 访问成功!");
			var res = JSON.parse(data);
			var credential = new gm.ngi.weibosdk.Credential();
			credential.loginName = loginName;
			credential.password = password;
			credential.accessToken = res.access_token;
			credential.expiresAt = new Date();
			credential.expiresAt.setSeconds(credential.expiresAt.getSeconds()
					+ new Number(res.remind_in));
			credential.userid = res.uid;
			this.credential = credential;
			if (callback) {
				appendLog("api内部 开始调用返回成功callback!");
				callback(true);
			}
			appendLog("api内部 访问成功调用完毕!");
		},
		error : function(xhr, message, exception) {
			appendLog("api内部 访问失败!");
			if (callback) {
				if (xhr.readyState < 4 && this.apiConnectionError) {
					appendLog("api内部 访问失败 state<4 或联接错误 apiConnectionError!");
					this.apiConnectionError(xhr);
				} else if (xhr.readyState >= 4 && this.apiServerError) {
					appendLog("api内部 访问失败 state>4 或服务错误 apiServerError!");
					var error = null;
					try{
						error = JSON.parse(xhr.responseText);
					}catch(err){
						
					}
					appendLog("api内部 访问失败 开始调用返回失败callback!");
					callback(false, error);
					this.apiServerError(error);
				}
				else
				{
					appendLog("api内部 访问失败 其他未知错误!");
					appendLog("api内部 访问失败 其他未知错误! 细节:m:"+message+" e:"+exception+" xhr:"+JSON.parse(xhr.responseText));
				}
			}
		}
	});

};

/*
 * 刷新用户凭据 如果用户凭据已过期，可使用此函数刷新用户凭据
 */
gm.ngi.weibosdk.Weibo.prototype.refreshCredential = function() {

};

// var WB = new gm.ngi.weibosdk.Weibo();
gm.ngi.weibosdk.api = new gm.ngi.weibosdk.Weibo();
