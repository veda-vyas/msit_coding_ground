$(function(){
	//alert("Inside Course.js File");	
	var octupus = {
		init: function(){
			
			$.getJSON("coursedata.json", function(data){
				console.log("Got JSON");
				//console.log(data["title"]);
				//jdata = JSON.parse(data);
				octupus.render(data);
			}).error(function(jqXhr, textstatus, error) {
				console.log("Error: "+textstatus+", "+error);
			});
			console.log("Bonkers");
			$('#courseStrtBtn').click(function(){
				console.log('in COURSEstartBtn CLICKED !!!');
				var myfs = require('fs');
				var ipc = require('electron').ipcRenderer;
			  	myfs.exists(__dirname+"/userdetails.json",function(exists){
			    	if(exists) {
						myJSON = myfs.readFile(__dirname+"/userdetails.json", flag="utf8", function(err, userdetails){
							userdetails=JSON.parse(userdetails);
							var qid=userdetails["lastseen_qid"];
							var modandless=qid.split(".");
							var modno=modandless[0];
							var lesno=modandless[1];
							setTimeout(function(){
								ipc.send('asynchronous-message', "\\module.html?mod="+modno+"&les="+lesno);
							}, 6000);
							
						});
		    		}else{
		    			ipc.send('asynchronous-message', "\\module.html?mod=1&les=1");
		    		}
	    		});
				
				
				//console.log('done');
			});
		},
		render: function(data){
			$('#cheading').html('<h1><b>'+data["title"]+'</b></h1>');
			//$('#ctrailer').html('<iframe class="embed-responsive-item" src="'+data["trailer"]+'" allowfullscreen></iframe>');
			$('#csummary').html(data["summary"]);
			$('#cwhycourse').html(data["whycourse"]);
			$('#crequirements').html(data["prerequisites"]);
			var javasyllabus = data["javasyllabus"];
			//alert(Object.keys(javasyllabus).length);
			for(var i=1; i <= Object.keys(javasyllabus).length; i++){
				$('#weeklyschedule').append('<h5><b>Week '+i+'</b></h5><ol>');
				var syllabus = javasyllabus[''+i];
				$('#weeklyschedule').append('<ol id="week'+i+'"></ol>');
				for(var j=1; j <= syllabus.length; j++){
					$('#week'+i).append('<li><a href="module.html?mod='+i+'&les='+j+'">'+syllabus[j-1]+'</a></li>');
				}
			}
			/*var syllabus = data["syllabus"];
			for(var i=1; i <= syllabus.length; i++){
				$('#syllabus_list').append('<li><a href="/module?mod='+i+'&les=1">'+syllabus[i-1]+'</a></li>');
			}*/
			
		}
	};
	
	octupus.init();
});