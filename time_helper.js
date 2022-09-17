function intervalled(n, dt, callback) {
  let handle = setTimeout(() => {
    callback();
    if (n>0) {
      intervalled(n-1, dt, callback)
    }
  }, dt);
  return handle;
}

export {intervalled}