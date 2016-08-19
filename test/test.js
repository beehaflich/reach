

$('document').ready(function() {
  var keys = ['apple', 'banana', 'carrot', 'durian', 'eggplant'];

  var get_arguments = function() {
    var args = {};
    for (var i = 0; i < keys.length; i++) {
      args[keys[i]] = +$('#' + keys[i]).val();
    }
    return args;
  };

  var post_results = function(results) {
    $('#results').html(
      '<div>You sent me <span class="result">' +
      results.fruit +
      '</span> ' +
      (results.fruit === 1 ? 'fruit' : 'fruits') +
      '.</div>' +
      '<div>You sent me <span class="result">' +
      results.vegetable +
      '</span> ' +
      (results.vegetable === 1 ? 'vegetable' : 'vegetables') +
      '</div>' +
      '<div>I generated a number for you - it\'s <span class="result">' +
      results.random +
      '</span>!</div>'
    );
  };

  $('#control').on('click', function() {
    var args = get_arguments();
    var results = {
      'fruit': args.apple + args.banana + args.durian,
      'vegetable': args.carrot + args.eggplant,
      'random': Math.floor(Math.random() * (10)) + 1
    };
    post_results(results);
  });

  $('#php').on('click', function() {
    var args = get_arguments();
    var url = 'test.php';
    // var test = new reach();
    var test = (new reach()).url(url).arguments(args);
    test.callback(function(response) {
      post_results(response);
    });
    test.send();
  });
});
