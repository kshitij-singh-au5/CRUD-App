$(document).ready(function () {
    $(".update").click(function(){
        var index = $(this).index(".update")
        
        var id = $(this)[0].id
        var name = $("#name-"+index).val();
        var username = $("#username-"+index).val();
        var email = $("#email-"+index).val();

        $("#id").val(id)
        $("#name").val(name)
        $("#username").val(username)
        $("#email").val(email)
        $("#myModal").modal("show")
    })
    $('#toast').toast('show');
    

    $(".delete").click(function(){
        var data  = {id: $(this)[0].id.replace("delete-","")}
        if (!confirm("Do you want to delete")){
            return false;
        }
        else{
            $.ajax({
                type: "POST",
                url: "/deleteuser",
                async: false,
                data: data,
                dataType: "JSON",
                success: function (response) {
                    window.location.href = response.url
                }
                
            });
        }
        
        // window.location.reload();
    })
});