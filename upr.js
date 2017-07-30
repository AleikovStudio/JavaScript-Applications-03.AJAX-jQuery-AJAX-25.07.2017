function loadRepos() {
    $("#repos").empty();
    let username = $("#username").val();
    $.get("https://api.github.com/users/" + username + "/repos")
        .then(function (data) {
            for (let repo of data) {
                let link = $("<a>");
                link.text(repo.full_name);
                link.attr("href", repo.html_url);
                link.attr("target", "_blank");
                let li = $("<li>").append(link);
                $("#repos").append(li);
            }
        })
        .catch(function () {
            $("#repos").append($("<li>Error</li>"));
        });
}

$(function () {
    $("#btnLoad").click(loadContacts);
    $("#btnCreate").click(createContact);

    const baseUrl = "https://phonebook-24fa5.firebaseio.com/phonebook";

    function loadContacts() {
        $("#phonebook").empty();
        $.get(baseUrl + ".json")
            .then(displayContacts)
            .catch(displayError);
    }

    function displayContacts(contacts) {
        let keys = Object.keys(contacts);
        for (let key of keys) {
            let contact = contacts[key];
            if (contact.person) {
                let li = $("<li>");
                li.text(contact.person + ": " + contact.phone + " ");
                li.appendTo($("#phonebook"));
                li.append(
                    $("<a href='#'>[Delete]</a>").click(function () {
                        deleteContact(key);
                    })
                );
            }
        }
    }

    function displayError() {
        $("#phonebook").html("<li>Error</li>");
    }

    function deleteContact(key) {
        let delRequest = {
            method: "DELETE",
            url: baseUrl + "/" + key + ".json"
        };
        $.ajax(delRequest)
            .then(loadContacts)
            .catch(displayError);
    }

    function createContact() {
        let person = $("#person").val();
        let phone = $("#phone").val();

        let newContact = {person, phone};

        let createRequest = {
            method: "POST",
            url: baseUrl + ".json",
            data: JSON.stringify(newContact)
        };
        $.ajax(createRequest)
            .then(loadContacts)
            .catch(displayError);
    }
});