_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
  // TODO: add appropriate regexes to output these, 
  //   we can't use erb style delims because rails will look for rails vars/vals
  //escape: //g,
  //evaluate: //g
};
