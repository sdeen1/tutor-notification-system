$(function() {
    $('#submit').click(function(){
        var table = $("#table").val();
        var className = $("#class").val();

        if (dataValidation()) {
          writeUserData(table, className);
          $("input").val(""); // Clear text boxes
          $('input').removeClass('invalid'); // if present
          // possible to do: toggle disabled class on submit button
        }
    });

    $('#clear').click(function() {
        removeData();
    });

    $('tbody').on("click", "td.close", function(){
        var key = $(this).parent().attr("id");
        removeData(key);
    });

});

function writeUserData(table, subject) {
    databaseRef = firebase.database().ref("rows");
    this.databaseRef.push({
          table: table,
          subject: subject,
      }).catch(function(error) {
          console.error("Error writing new message to Firebase Database", error);
          displayError("write");
      });
}

function loadTable() {
    databaseRef = firebase.database().ref('rows');

    databaseRef.on('child_added', function(data) {
         var key = data.key;
         var childData = data.val();
         displayRow(key, childData.subject, childData.table);
    });
    databaseRef.on('child_removed', function(data) {
        var key = data.key;
        removeRow(key);
    });

}

function removeData(key) {
    if (key) {
        var ref = firebase.database().ref('rows/'+key);
    } else {
        var ref = firebase.database().ref('rows');
    }
    ref.remove()
        .then(function() {
            console.log("Remove succeeded.");
        })
        .catch(function(error) {
            console.log("Remove failed: " + error.message);
            displayError("remove");
        });
}

loadTable();

function displayRow(key, subject, table) {
    var tableObj = $("table");
    var html = "<tr id='"+key+"'><td>"+table+"</td>"+
                "<td>"+subject+"</td><td class='close'><span class='ui basic button'>X</span></td></tr>";
    tableObj.append(html);
}

function removeRow(key) {
    $('#'+key).remove();
}

function displayError(err) {
  var mes = $('#error-message');
  var html = "<p>There was an error"
  if (err == "write") {
    html = html + " writing to the database";
  } else if (err == "remove") {
    html = html + " removing your item from the database";
  }
  html = html + ". Please email mpc.stem@gmail.com with a description of the error.</p>";
  mes.append(html);
  mes.show();
  $('.close').click(function() { mes.hide(); });
}

function dataValidation() {
  var tableInp = $('#table'),
      classInp = $('#class'),

      tableVal = tableInp.val(),
      classVal = classInp.val();

  tableInp.removeClass('invalid');
  classInp.removeClass('invalid');

  if (classVal.length > 9 || tableVal.length > 9) {
    if (classVal.length > 9) {
      classInp.addClass('invalid');
    }
    if (tableVal.length > 9) {
      tableInp.addClass('invalid');
    }
    return false;
  }
  return true;
}
