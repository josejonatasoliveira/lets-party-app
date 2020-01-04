
const URI = 'http://192.168.1.37:8000/api/v1/'
export default class BackService{


  static get(resource){
    const uri = URI + resource;

      return fetch(uri,{
        mode:'cors',
        method:'GET'
      })
      .then(resposta => resposta.json());
  }


  static post(resource, data){
    const uri = URI + resource;

    return fetch(uri,{
      method:'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(resposta => resposta.json());

  }

}