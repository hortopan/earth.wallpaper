module.exports = function(app){

	this.app = app;
	this.currentWallpaper = null;

	this.init = function(){
		this.refreshWallpaper();
		setInterval(this.refreshWallpaper.bind(this), 60*1000*3);
	}

	this.refreshWallpaper = function(force){
		this.getWallpaper(force, function(err, file){
			if (err){
				console.error(err);
				return;
			}

			this.setWallpaper(file, force);
		});
	}

	this.setWallpaper = function(file, force){

		if (this.currentWallpaper == file && !force){
			return;
		}

		const wallpaper = require('wallpaper');

		wallpaper.set(file).then(function(e){
			this.currentWallpaper = file;
		});

	}

	this.getWallpaper = function(force, back){

		require('request').get('http://himawari8-dl.nict.go.jp/himawari8/img/D531106/latest.json', function(err,res){
			
			if (err || res.statusCode != 200){
				return back(new Error('http_statusCode'));
			}

			try{
				var json = JSON.parse(res.body);
			} catch(E){
				return back(new Error('invalid_json'));
			}

			var d = new Date(json.date);
			var year = d.getUTCFullYear().toString();
			var month = d.getUTCMonth().toString();
			var day = d.getUTCDate().toString();
			var hour = d.getUTCHours().toString();
			var minute = d.getUTCMinutes().toString();

			var pad = function(input){
				if (input.length == 1){
					return '0'+input;
				}
				return input;
			}

			month = pad(month);
			day = pad(day);
			hour = pad(hour);
			minute = pad(minute);

		var url = `http://himawari8-dl.nict.go.jp/himawari8/img/D531106/1d/550/${year}/${month}/${day}/${hour}${minute}00_0_0.png`;
		var tempFile = require('path').join(app.getPath('temp'), d.getTime().toString() + '.png');

		require('fs').exists(tempFile, function(exists){

			if (exists && !force){
				return back(null, tempFile);
			}

			var ws = require('fs').createWriteStream(tempFile);
			ws.on('finish', function(){
				if (statusCode == 200){
					return back(null, tempFile);
				}

				require('fs').unlink(tempFile, function(err){
					return back(new Error('http_statusCode'));
				});

			});	

			var statusCode = 0;
			require('request').get(url).on('response', function(response){
				statusCode = response.statusCode;
			}).pipe(ws);


		});

	});
}

return this;

}