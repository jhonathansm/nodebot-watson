require('./config.env');

const Builder = require('ibm-watson/assistant/v1'),
		prompts = require('prompts'),
		shell=require('shelljs'),
		watson = new Builder({
  			iam_apikey:process.env.api_key,
  			url:process.env.url,
  			version: '2019-02-28'
		});

	let counter = 0,

	art = () =>{
		console.log(" ##      ##    ###    ########  ######   #######  ##    ##    ########   #######  ######## ");console.log(" ##  ##  ##   ## ##      ##    ##    ## ##     ## ###   ##    ##     ## ##     ##    ##    ");console.log(" ##  ##  ##  ##   ##     ##    ##       ##     ## ####  ##    ##     ## ##     ##    ##    ");console.log(" ##  ##  ## ##     ##    ##     ######  ##     ## ## ## ##    ########  ##     ##    ##    ");console.log(" ##  ##  ## #########    ##          ## ##     ## ##  ####    ##     ## ##     ##    ##    ");console.log(" ##  ##  ## ##     ##    ##    ##    ## ##     ## ##   ###    ##     ## ##     ##    ##    ");console.log("  ###  ###  ##     ##    ##     ######   #######  ##    ##    ########   #######     ##    ");
	}

async function getUserMessage(){
	
	if( counter == 0 ){
		console.clear();
		art();
		callWatson();
	}
	else{
		console.log('\r\n');	
		
		let userInput = await prompts({
    		type: 'text',
    		name: 'message',
    		message: 'Mensagem: '
		});
	
		if( userInput.message =='exit' ){
			console.log('\r\n');	
			console.log('Espero ter ajudado. Até mais...');	
			console.log('\r\n');	
			shell.exec('killall node');
		}
	
		else if ( userInput.message !='' ){
			callWatson(userInput.message)
		}
		
		else{
			console.log('i dont have super-powers. Please, type anything.')
			console.log('\r\n');
			console.log('If you wanna exit type\'exit\'');
			getUserMessage();
		}
	}
}



function callWatson(x){
	counter=1;
	watson.message({workspace_id: process.env.workspaceID,input: {'text': x}},(e,r)=>{
		if(e){
			console.log(e);
		}
		else{
			console.log('\r\n');	

			const wR = JSON.parse(JSON.stringify(r));

				// console.log(wR);

				let	intent = wR.intents[0] > '' ? wR.intents[0].intent : false ,
					confidence = wR.intents[0] > '' ? wR.intents[0].confidence : false,
					
					entities = wR.entities[0] > '' ? JSON.stringify(wR.entities[0]) : false,

					userInput = wR.input > '' ? JSON.parse(JSON.stringify(wR.input)).text : false,

					output = JSON.stringify(wR.output),

					outputOptionsGeneral = JSON.parse(output).generic[2] > '' ?  JSON.parse(output).generic[2].options  :  false, 
					
					outputOptionsSpecific = JSON.parse(output).generic[1] > '' ?  JSON.parse(output).generic[1].options  :  false, 

					context = JSON.stringify(wR.context);  

					// console.log(outputOptionsGeneral);
					// console.log(outputOptions);


				// console.log('------------------------------------------------------------------------');
				// console.log('PRODUCTION INFORMATIONS:');
				// console.log('\r\n');

				// console.log ('Intenções: ' + intent);
				// console.log ('Confidencia: ' + confidence);
				
				// console.log ('Entities: ' + entities);
				// console.log ('Entrada do usuario: ' + userInput);
				// console.log('\r\n');
				// console.log ('Saida do bot: ' + output);
				// console.log('\r\n');
				
				// console.log ('contexto: ' + context);
				
				// console.log('\r\n');
				// console.log('------------------------------------------------------------------------');
				// console.log('\n');

				console.log('BOT OUTPUT:');
				console.log('');
		
				Object.keys(JSON.parse(output).text).forEach(function(x) {
					if(JSON.parse(output).text[x]=="Até mais!"){
						shell.exec('killall node');
					}else{
						console.log(JSON.parse(output).text[x]);
					}
				});

				// when have General options
		

				if(outputOptionsGeneral != false){
					console.log('-');
					Object.keys(outputOptionsGeneral).forEach(function(y) {
						console.log(outputOptionsGeneral[y].label);

					})
				}

				// When have specific options
				if(outputOptionsSpecific != null){
					console.log('-');
					Object.keys(outputOptionsSpecific).forEach(function(z) {
						console.log(outputOptionsSpecific[z].label);

					})
				}
				// }

		getUserMessage();
		}
	});
}			
callWatson();