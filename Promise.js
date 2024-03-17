class MyPromise {
  key = { pending: 'pending', fullfilled: 'fullfilled', rejected: 'rejected' };
  state = 'pending';
  value = undefined;
  reason = undefined;
  resolveCallbacks = [];
  rejectedCallbacks = [];
  constructor(fn) {
    const resolveHandler = (value) => {
      this.value = value;
      this.state = this.key.fullfilled;
      this.resolveCallbacks.forEach((f) => f(value));
    };
    const rejectedHandler = (reason) => {
      this.reason = reason;
      this.state = this.key.rejected;
      this.rejectedCallbacks.forEach((f) => f(value));
    };
    try {
      fn(resolveHandler, rejectedHandler);
    } catch (err) {
      rejectedHandler(err);
    }
  }
  then(fn1, fn2) {
    fn1 = typeof fn1 == 'function' ? fn1 : (v) => v;
    fn2 = typeof fn2 == 'function' ? fn2 : (v) => v;
    if (this.state == this.key.pending) {
      return new MyPromise((resolve, reject) => {
        this.resolveCallbacks(() => {
          try {
            const v = fn1(this.value);
            resolve(v);
          } catch (er) {
            reject(er);
          }
        });
        this.rejectedCallbacks(() => {
          try {
            const v = fn2(this.reason);
            reject(v);
          } catch (er) {
            reject(er);
          }
        });
      });
    }
    if (this.state == this.key.fullfilled) {
      return new MyPromise((resolve, reject) => {
        this.resolveCallbacks(() => {
          try {
            const v = fn1(this.value);
            resolve(v);
          } catch (er) {
            reject(er);
          }
        });
      });
    }
    if (this.state == this.key.rejected) {
      return new MyPromise((resolve, reject) => {
        this.rejectedCallbacks(() => {
          try {
            const v = fn2(this.reason);
            reject(v);
          } catch (er) {
            reject(er);
          }
        });
      });
    }
  }
  catch(fn) {
    this.then(null, fn);
  }
}

MyPromise.resolve = (value) => {
  return new Promise((resolve) => resolve(value));
};

MyPromise.reject = (reason) => {
  return new Promise((resolve, reject) => reject(reason));
};

MyPromise.all = (promiseList) => {
  return new MyPromise((resolve, reject) => {
    const result = [];
    promiseList.forEach((f) => {
      f.then((value) => {
        result.push(value);

        if (result.length == promiseList.length) {
          resolve(result);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  });
};

MyPromise.race = (promiseList) => {
  let tag = false;
  return new MyPromise((resolve, reject) => {
    promiseList.forEach((f) => {
      f.then((value) => {
        tag = true;
        if (!tag) {
          resolve(value);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  });
};
