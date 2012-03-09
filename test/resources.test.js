describe('Resources', function(){
  describe('GET /resources', function(){
    it('should return a list of resources', function(done) {
      resources.get(function(err, res) {
        data.resources.todos._id = res[0]._id;
        expect(res[0]).to.eql(data.resources.todos);
        done(err);
      })
    })
  })
  
  describe('GET /resources?path=', function(){
    it('should return a single result', function(done) {
      resources.get({path: '/users'}, function (err, res) {
        expect(res).to.have.length(1);
        done(err);
      })
    })
  })
  
  describe('POST /resources', function(){
    it('should add a new resource', function(done) {
      clear(function (e) {        
        resources.post(data.resources.todos, function (err, res) {
          resources.get({path: data.resources.todos.path}, function (error, r) {
            expect(r[0]).to.eql(res);
            done(error || err);
          })
        })
      })
    })
  })
  
  describe('PUT /resources', function(){
    it('should updated the resources that match the query', function(done) {
      resources.get({path: data.resources.todos.path}).put({$set: {path: '/foo'}}, function (err) {
        resources.get({path: '/foo'}, function (error, res) {
          expect(res).to.have.length(1);
          done(error || err);
        })
      })
    })
  })
  
  describe('PUT /resources/<ObjectID>', function(){
    it('should updated the resources that match the query', function(done) {
      resources.get(function (e, all) {
        var res = all[0];
        
        res.order = 777;
        resources.get({_id: res._id}).put(res, function (err, upd) {
          // FIXES NESTED MDOQ-HTTP BUG :(
          resources.req = {};
          resources.get(function (error, chgd) {
            var i;
            
            // REMOVE ONCE MDOQ-HTTP IS PATCHED!
            while(i = chgd.shift()) {
              if(i._id == res._id) break;
            }
            
            expect(i.order).to.equal(777);
            done(err);
          })
        })
      })
    })
  })
  
  describe('DELETE /resources', function(){
    it('should remove all resources or those that match the query', function(done) {
      resources.del(function (err) {
        resources.get(function (error, all) {
          expect(all).to.not.exist;
          done(error || err);
        })
      })
    })
  })
})