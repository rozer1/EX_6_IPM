$(document).ready(function(){
	//Open Database
	var request = indexedDB.open('customermanager',1);
	
	request.onupgradeneeded = function(e){
		var db = e.target.result;
		
		if(!db.objectStoreNames.contains('customers')){
			var os = db.createObjectStore('customers',{keyPath: "id", autoIncrement:true});
			//Create Index for Name
			os.createIndex('name','name',{unique:false});
		}
	}
	
	//Success
	request.onsuccess = function(e){
		console.log('Success: Opened Database...');
		db = e.target.result;
		//Show Customers
		showCustomers();
	}
	
	//Error
	request.onerror = function(e){
		console.log('Error: Could Not Open Database...');
	}
});

//Add Customer
function addCustomer(){
	var name = $('#name').val();
	var city = $('#city').val();
	var adress = $('#adress').val();
	var email = $('#email').val();
	var postal_code = $('#postal_code').val();
	var nip_number = $('#nip_number').val();
	var phone_number = $('#phone_number').val();
	var id_card = $('#id_card').val();
	
	var transaction = db.transaction(["customers"],"readwrite");
	//Ask for ObjectStore
	var store = transaction.objectStore("customers");
	
	//Define Customer
	var customer = {
		name: name,
		city: city,
		adress: adress,
		email: email,
		postal_code: postal_code,
		nip_number: nip_number,
		phone_number: phone_number,
		id_card: id_card,
	}
	
	//Perform the Add
	var request = store.add(customer);
	
	//Success
	request.onsuccess = function(e){
		window.location.href="index.html";
	}
	
	//Error
	request.onerror = function(e){
		alert("Sorry, the customer was not added");
		console.log('Error', e.target.error.name);
	}
}

//Display Customers
function showCustomers(e){
	var transaction = db.transaction(["customers"],"readonly");
	//Ask for ObjectStore
	var store = transaction.objectStore("customers");
	var index = store.index('name');
	
	var output = '';
	index.openCursor().onsuccess = function(e){
		var cursor = e.target.result;
		if(cursor){
			output += "<tr id='customer_"+cursor.value.id+"'>";
			output += "<td><span class='cursor customer' contenteditable='true' data-field='name' data-id='"+cursor.value.id+"'>"+cursor.value.name+"</span></td>";
			output += "<td><span class='cursor customer' contenteditable='true' data-field='city' data-id='"+cursor.value.id+"'>"+cursor.value.city+"</span></td>";
			output += "<td><span class='cursor customer' contenteditable='true' data-field='adress' data-id='"+cursor.value.id+"'>"+cursor.value.adress+"</span></td>";
			output += "<td><span class='cursor customer' contenteditable='true' data-field='email' data-id='"+cursor.value.id+"'>"+cursor.value.email+"</span></td>";
			output += "<td><span class='cursor customer' contenteditable='true' data-field='postal_code' data-id='"+cursor.value.id+"'>"+cursor.value.postal_code+"</span></td>";
			output += "<td><span class='cursor customer' contenteditable='true' data-field='nip_number' data-id='"+cursor.value.id+"'>"+cursor.value.nip_number+"</span></td>";
			output += "<td><span class='cursor customer' contenteditable='true' data-field='phone_number' data-id='"+cursor.value.id+"'>"+cursor.value.phone_number+"</span></td>";
			output += "<td><span class='cursor customer' contenteditable='true' data-field='id_card' data-id='"+cursor.value.id+"'>"+cursor.value.id_card+"</span></td>";
			output += "<td><a onclick='removeCustomer("+cursor.value.id+")' href=''>Delete</a></td>";
			output += "</tr>";
			cursor.continue();
		}
		$('#customers').html(output);
	}
}

//Delete A Customer
function removeCustomer(id){
	var transaction = db.transaction(["customers"],"readwrite");
	//Ask for ObjectStore
	var store = transaction.objectStore("customers");
	
	var request = store.delete(id);
	
	//Success
	request.onsuccess = function(){
		console.log('customer '+id+' Deleted');
		$('.customer_'+id).remove();
	}
	
	//Error
	request.onerror = function(e){
		alert("Sorry, the customer was not removed");
		console.log('Error', e.target.error.name);
	}
}

//Clear ALL Customers
function clearCustomers(){
	indexedDB.deleteDatabase('customermanager');
	window.location.href="index.html";
}

//Update Customers
$('#customers').on('blur','.customer',function(){
	//Newly entered text
	var newText = $(this).html();
	//Field
	var field = $(this).data('field');
	//Customer ID
	var id = $(this).data('id');
	
	//Get Transaction
	var transaction = db.transaction(["customers"],"readwrite");
	//Ask for ObjectStore
	var store = transaction.objectStore("customers");
	
	var request = store.get(id);
	
	request.onsuccess = function(){
		var data = request.result;
		if(field == 'name'){
			data.name = newText;
		}else if(field == 'city'){
			data.city = newText;
		} else if(field == 'adress'){
			data.adress = newText;
		}else if(field == 'email'){
			data.email = newText;
		}else if(field == 'postal_code'){
			data.postal_code = newText;
		}else if(field == 'nip_number'){
			data.nip_number = newText;
		}else if(field == 'id_card'){
			data.id_card = newText;
		}
		
		//Store Updated Text
		var requestUpdate = store.put(data);
		
		requestUpdate.onsuccess = function(){
			console.log('Customer field updated...');
		}
		
		requestUpdate.onerror = function(){
			console.log('Error: Customer field NOT updated...');
		}
	}
});

function searchTable() {
			var input, filter, found, table, tr, td, i, j;
			input = document.getElementById("myInput");
			filter = input.value.toUpperCase();
			table = document.getElementById("myTable");
			tr = table.getElementsByTagName("tr");
			for (i = 0; i < tr.length; i++) {
				td = tr[i].getElementsByTagName("td");
				for (j = 0; j < td.length; j++) {
					if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
						found = true;
					}
				}
				if (found) {
					tr[i].style.display = "";
					found = false;
				} else {
					tr[i].style.display = "none";
				}
			}
		}