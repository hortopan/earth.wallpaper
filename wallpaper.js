module.exports = function(app){

	this.app = app;
	this.currentWallpaper = null;

	this.init = function(){
		this.refreshWallpaper();
		//setInterval(this.refreshWallpaper.bind(this), 1500);
	}

	this.refreshWallpaper = function(){
		this.getWallpaper(function(err, file){
			if (err){
				console.error(err);
				return;
			}

			this.setWallpaper(file);
		});
	}

	this.setWallpaper = function(file){

		if (this.currentWallpaper == file){
			return;
		}

		var width = require('electron').screen.getPrimaryDisplay().workAreaSize.width;
		var height = require('electron').screen.getPrimaryDisplay().workAreaSize.height;

		const gd = require('node-gd');
		gd.openPng(file, function(err,fgImg){

			if (err){
				return;
			}

			if (fgImg.width >= width){
				this._setWallpaper(file);
				return;
			}

			gd.createTrueColor(width, height, function(err,bgImg){

				if (err){
					return;
				}


				var x = Math.ceil((width - fgImg.width)/2);
				var y = Math.ceil((height - fgImg.height)/2);
				fgImg.copy(bgImg, x, y, 0, 0, fgImg.width, fgImg.height);

				bgImg.saveFile(file, function(err){
					if (err){
						return back;
					}

					this._setWallpaper(file);
				});

			});

		})

	}

	this._setWallpaper = function(file){
		require('child_process').exec(`osascript -e 'tell application "Finder" to set desktop picture to POSIX file "${file}"'`, function(e,o,eo){
			if (e){
				console.error(e);
			} else {
				this.currentWallpaper = file;
			}
		});
	}

	this.getWallpaper = function(back){

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

			if (exists){
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