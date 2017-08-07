$(() => {
    const appKey='kid_B1PypVGw-';
    const appSecret='df78b80e7838443997697dd6dc8a6ee6';
    const host='https://baas.kinvey.com/';
    const AppHeaders={
        'Authorization' : 'Basic ' + btoa(appKey + ":" + appSecret)
    };
    function userHeaders() {
        return {
            'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')
        }
    }
    sessionStorage.clear();
    showLinks();
    $('#linkHome').on('click', ()=>{
        $('main').find('section').hide();
        $('#viewHome').show();
    });
    $('#linkLogin').on('click', ()=>{
        $('main').find('section').hide();
        $('#viewLogin').show();
    });
    $('#linkRegister').on('click', ()=>{
        $('main').find('section').hide();
        $('#viewRegister').show();
    });
    $('#linkListBooks').on('click', listBooks);
    $('#linkCreateBook').on('click', viewcreateBook);
    $('#linkLogout').on('click', logout);

    $('#viewRegister').find('input[type="submit"]').on('click',register);
    $('#viewLogin').find('input[type="submit"]').on('click', login);
    $('#viewCreateBook').find('input[type="submit"]').on('click', createBook);
    function viewcreateBook() {
        $('main').find('section').hide();
        $('#viewCreateBook').show();
    }
    function logout() {
        sessionStorage.clear();
        $('#loggedInUser').text('');
        showLinks();
    }
    function createBook(event) {
        event.preventDefault();
        let createBookForm=$('#formCreateBook');
        $.ajax({
            method:"POST",
            url: `${host}appdata/${appKey}/books`,
            headers:userHeaders(),
            data:{
                title:$(createBookForm).find('input[name="title"]').val(),
                author: $(createBookForm).find('input[name="author"]').val(),
                description: $(createBookForm).find('textarea[name="description"]').val()
            }
        }).then(()=>{
            $('#books').remove('#book');
            listBooks()
        });
    }
    async function listBooks() {
        $('main').find('section').hide();

       await $.ajax({
            method:"GET",
            url:`${host}appdata/${appKey}/books`,
            headers:userHeaders(),
        }).then((data)=>{
            console.log(data);
            for(let i=0;i<data.length;i++){
                let book=data[i];

                let tr=$('<tr>').attr('id','book').append($('<td>').text(`${data[i].title}`)).append($('<td>').text(`${data[i].author}`)).append($('<td>').text(`${data[i].description}`));
                console.log(sessionStorage);
                if(data[i]._acl.creator==sessionStorage['userId']){
                    tr.append($('<td>').append([$('<a href="#">[Delete]</a>').click(deleteBook),$('<a href="#">[Edit]</a>').click(editBook)]))
                }
                $('#books').find('table').append(tr);
                $('#viewBooks').show();
            }

        });


    }
    function deleteBook() {
     console.log(this);
    }
    function editBook() {
        console.log('edit');
    }
    function login(event) {
        event.preventDefault();
        $.ajax({
            method:"POST",
            url:`${host}user/${appKey}/login`,
            headers:AppHeaders,
            data:data('#formLogin')
        }).then(responseHandler)
    }
    function register(event) {
        event.preventDefault();
        console.log(`${host}user/${appKey}/`);
        $.ajax({
            method: "POST",
            url:`${host}user/${appKey}/`,
            headers:AppHeaders,
            data:data('#viewRegister')
        }).then(responseHandler);
    }
    function responseHandler(response){
        sessionStorage.setItem('authToken', response._kmd.authtoken);
        sessionStorage.setItem('userId', response._id);
        showLinks();
        $('#loggedInUser').text(`Welcome, ${response.username}!`);
        listBooks();
    }
    function data(form) {
        return {
            username: $(form).find('input[name="username"]').val(),
            password: $(form).find('input[name="passwd"]').val()
        };
    }
    function showLinks() {
        $('#linkHome').show();
        if(sessionStorage.getItem('authToken')){
            $('#linkLogin').hide();
            $('#linkRegister').hide();
            $('#linkListBooks').show();
            $('#linkCreateBook').show();
            $('#linkLogout').show();
        }
        else{
            $('#linkLogin').show();
            $('#linkRegister').show();
            $('#linkListBooks').hide();
            $('#linkCreateBook').hide();
            $('#linkLogout').hide();
        }
    }
});