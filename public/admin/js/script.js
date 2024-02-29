//button status
const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0){
    let url = new URL(window.location.href);

    buttonsStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if(status) {
                url.searchParams.set("status", status);
            }
            else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        })
    })
}
//end button status

//search 
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        const keyword = event.target.elements.keyword.value;

        if(keyword){
            url.searchParams.set("keyword", keyword);
        }else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    })
}
//end search

//pagination
const buttonPage = document.querySelectorAll("[button-page]");
if (buttonPage.length > 0){  
    let url = new URL(window.location.href);

    buttonPage.forEach((button) => {
        button.addEventListener("click", (event) => {
            const page = button.getAttribute("button-page");
            
            url.searchParams.set("page", page);

            window.location.href = url.href;
        

        })
    })

}
//end pagination 

//button chang-status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("[form-change-status]");
    const path = formChangeStatus.getAttribute("data-path");
    


    buttonChangeStatus.forEach((button) => {
        button.addEventListener("click", () => {
            

            const id = button.getAttribute("data-id");
            const currentStatus = button.getAttribute("data-status");
            
            const changeStatus = currentStatus=="active" ? "inactive" : "active";

            const action = `${path}/${changeStatus}/${id}?_method=PATCH`;

            formChangeStatus.action = action;

            formChangeStatus.submit();
            
        })
    })
}

//end button change-status

//checkbox multi
const checkBoxMulti = document.querySelector(".check-multi");
if (checkBoxMulti) {
    const checkBoxAll = checkBoxMulti.querySelector('input[name="checkAll"]');
    const checkBoxID = checkBoxMulti.querySelectorAll('input[name="checkID"]');

    checkBoxAll.addEventListener("click",() => {
        if(checkBoxAll.checked){
            checkBoxID.forEach(box => {
                box.checked = true;
            })
        }
        else{
            checkBoxID.forEach(box => {
                box.checked = false;
            })
        }
    })

    checkBoxID.forEach(box => {
        box.addEventListener("click", () => {
            const countCheckedBox = checkBoxMulti.querySelectorAll("input[name='checkID']:checked").length;
            if(countCheckedBox == checkBoxID.length){
                checkBoxAll.checked = true;
            }
            else{
                checkBoxAll.checked = false;
            }
        })
    })
//end checkbox multi

//form-change-multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (event) => {
        event.preventDefault();
        const type = event.target.elements.type.value;
        
        if(type=="delete-all"){
            const isConfirm = confirm("Bạn có chắc muốn xóa các bản ghi này?");

            if(!isConfirm){
                return;
            }
        }
        const checkedBoxID = checkBoxMulti.querySelectorAll("input[name='checkID']:checked");

        if  (checkedBoxID.length > 0){
            const ids = [];
            checkedBoxID.forEach(box => {
                const id = box.value;

                if (type=="change-position"){
                    const position = box.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                }
                else {
                    ids.push(id);
                }
            })
            
            const formIds = formChangeMulti.querySelector("input[name='ids']");
            formIds.value = ids.join(", ");
            
            formChangeMulti.submit();
            
        }
        else{
            alert("Vui lòng chọn ít nhất một bản ghi");
        }
        

    })
}
}
//end form-change-multi
//delete button
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("[form-delete-item]");
    const path = formDeleteItem.getAttribute("data-path");
    

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa bản ghi này?");
            
            if(isConfirm) {
                const id = button.getAttribute("data-id");

                const action = `${path}/${id}/?_method=DELETE`;
                console.log(action);

                formDeleteItem.action = action;

                formDeleteItem.submit();
            }

        })
    })
}

//end delete button

//show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    },time);

    const closeAlert = showAlert.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })

}
//end show alert

//preview image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener("change", (event) => {
        const [file] = uploadImageInput.files;
        
        if (file) {

            uploadImagePreview.src = URL.createObjectURL(file);
        }
    })
}
//end preview image

//sort
const sort = document.querySelector("[sort]");
if (sort) {
    let url = new URL(window.location.href);

    const selectSort = sort.querySelector("[sort-select]");
    const clearSort = sort.querySelector("[sort-clear]");
    //sap xep
    selectSort.addEventListener("change", () => {
        const [sortKey , sortValue] = selectSort.value.split("-");

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;
    })

    //xoa sap xep
    clearSort.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;
    })

    //Them selected cho option
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if(sortKey && sortValue) {
        const string = `${sortKey}-${sortValue}`;
        const option = selectSort.querySelector(`option[value=${string}]`);

        option.selected = true;
        // optionSelected.setAttribute("selected", true);
    }


}
//end sort

//permission
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
    //submit Data
    const buttonSubmit = document.querySelector("[button-submit");
    const roles = [];
    buttonSubmit.addEventListener("click", () => {
        const rows = tablePermissions.querySelectorAll("[data-name]");
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if (name == "id") {
                inputs.forEach(input => {
                    const info = {
                        id : input.value,   
                        permissions : []
                    }
                    roles.push(info);
                })
            }
            else {
                inputs.forEach((input, index) => {
                    if (input.checked == true){
                        roles[index].permissions.push(name);
                    }
                })
            }
        })

        const formChangePermissions = document.querySelector("[form-change-permissions]");
        const inputRoles = formChangePermissions.querySelector("input[name='roles']");
        inputRoles.value = JSON.stringify(roles);
        formChangePermissions.submit();
    })
    //data default
    const divDataRecords = document.querySelector("[data-records");
    if (divDataRecords) {
        const records = JSON.parse(divDataRecords.getAttribute("data-records"));
        records.forEach((record, index) => {
            const permissions = record.permissions;

            permissions.forEach(permission => {
                const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
                const input = row.querySelectorAll("input")[index];
                input.checked = true;
            })
        })
    }
}

//end permission