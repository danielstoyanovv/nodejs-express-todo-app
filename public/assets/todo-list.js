$(document).ready(function(){

    // $('form').on('submit', function(){
    //     var item = $('form input');
    //     var todo = {item: item.val()};
    //
    //     $.ajax({
    //         type: 'POST',
    //         url: '/todo',
    //         data: todo,
    //         success: function(data){
    //            console.log(data);
               //
               //
               //
               // if (data.errors) {
               //  alert('errors');
               //
               //  var errors = data.errors;
               //  Object.keys(errors).forEach(key=>{
               //      alert(key);
               //
               //      alert(errors[key].msg);
               //  })

               // }
            //   console.log(data);
            //    alert('data');
              //  location.reload();
            // }
        // });
        //
        // return false;
    //
    // });

    $('li').on('click', function(){
        var item = $(this).data('id');
        $.ajax({
            type: 'DELETE',
            url: '/todo/' + item,
            success: function(data){
                //do something with the data via front-end framework
                location.reload();
            }
        });
    });

});