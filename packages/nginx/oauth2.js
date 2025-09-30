function introspectAccessToken(r) {
  if(r.headersIn.authorization === undefined) {
    return r.return(204);
  }
  r.subrequest("/_oauth2_send_request", (reply) => {
    if (reply.status !== 200) {
      return r.return(401);
    }
    const response = JSON.parse(reply.responseText);
    if (response.active !== true) {
      return r.return(403); 
    }
    r.return(204);
  });
}


export default { introspectAccessToken }