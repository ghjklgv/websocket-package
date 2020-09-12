import StaticService from "../Server/static";

export default class bmsWebSocket {
  wsConnectionData;
  resPonese;
  wsConnection;
  urlLink;
  dataBlock;
  constructor() {}
  onConnection = (url, data) => {
    this.urlLink = url;
    this.dataBlock = data;
    var loc = window.location;
    var new_uri = "";
    if (loc.protocol === "https:") {
      new_uri = "wss:";
    } else {
      new_uri = "ws:";
    }
    this.wsConnection = new WebSocket(
      new_uri + "//" + StaticService.url + url + sessionStorage.userToken
    );
    this.wsConnection.onopen = () => {
      this.wsConnection.send(JSON.stringify(data));
    };
  };
  onSocketMsg = (getEventConnectionData) => {
    this.wsConnection.onmessage = (evt) => {
      let resData = JSON.parse(evt.data);
      getEventConnectionData(resData);
    };
  };
  onSocketClose = (sockErrorEvent) => {
    this.wsConnection.onclose = (err) => {
      if (err.code === 1008) {
        sockErrorEvent(err);
      } else if (err.code === 1000) {
        return "Change Page Close Socket";
      } else {
        setTimeout(() => this.onConnection(this.urlLink, this.dataBlock), 5000);
      }
    };
  };
  onSocketSentData = (data) => {
    this.dataBlock = data;
    this.wsConnection.send(JSON.stringify(data));
  };
  onEventSocketClose = () => {
    if(this.wsConnection){
      if (this.wsConnection.readyState == this.wsConnection.OPEN) {
        this.wsConnection.close(1000, "Websocket Close");
      }
    }
  };
}
