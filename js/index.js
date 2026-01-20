let formInput = document.querySelector("form");
let inputt = document.querySelector("input");
let loding = document.querySelector(".loding");
const apiKey = "696ec9086529ede9bbcbd087";

getAllTodos(); //علشان اول مفتح تعرض الداتا المتخزنه

formInput.addEventListener("submit", (e) => {
  //e شايل معبومات الايفنت
  e.preventDefault(); //الفاء السلوك الافتراضي للفورم ال هو ريلود

  // addTodos()//call function علشان تبعت الداتال للباك

  if (inputt.value.trim().length > 0) {
    //هتشتغل لو اليوزر دخل داتا
    addTodos();
  } else {
    //لو اليوزر مدخلش داتا
    toastr.error("Enter Data");
  }
});
//! add Todos
async function addTodos() {
  let bodyData = {
    title: inputt.value,
    apiKey: apiKey,
  };
//   console.log(bodyData);
  let obj = {
    method: "POST",
    body: JSON.stringify(bodyData),
    headers: {
      "content-type": "application/json",
    },
  };
  showLoding(); //show Loding
  let res = await fetch("https://todos.routemisr.com/api/v1/todos", obj); //call api

  if (res.ok) {
    let data = await res.json(); //بستقبل الداتا ال راجعه من الباك
    // console.log(data);
    if (data.message === "success") {
      toastr.success("Added successfully", "Welcome"); //alert
      await getAllTodos();

      formInput.reset(); //بتخليني افضي الكلام ال موجود ف الانبوت
    } else {
      //لو اليوزر مدخلش داتا
      // toastr.error('Enter Data')
    }
  }
  hideLoding(); //hideLoding
  document.querySelector(".task-cotainer").classList.remove("d-none")

}
//! getAllTodos
async function getAllTodos() {
  showLoding(); //show Loding
  let res = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`);
  if (res.ok) {
    let da = await res.json();
    if (da.message === "success") {
      let allData = da.todos;
      
      displayData(allData);
      // console.log(allData);
      if(allData.length>=!0){
  document.querySelector(".task-cotainer").classList.remove("d-none")

      }
    }
    
  }
  hideLoding(); //hideLoding
}
//! display Data
function displayData(allData) {
    // console.log(allData);
  let cartona = [];
  for (const item of allData) {
    cartona += `
     <li class="px-2 py-3 bg-body border-bottom border-2 border-secondary rounded shadow my-2 d-flex justify-content-between ">
            <span onclick="markCompleted('${item._id}')" style=" ${item.completed ? "text-decoration: line-through;" : ""}" class="task-name  w-75  text-wrap">${item.title}</span>
            <div class=" d-flex align-items-center justify-content-between gap-3">
               ${item.completed ? '<span class="checkd-task"><i class="far fa-check-circle fa-beat" style="color: #025f43;"></i></span>' : '<span class="nocheckd-task"><i class="fa-solid fa-bolt fa-flip" style="color: #9c9477;"></i></span>'}
                <span onclick="deleteItem('${item._id}')" class="delet-task "><i class="fas fa-trash-alt"></i></span>
                <div class="position-relative">
                <span onclick="date('${item.updatedAt}')"  class="fs-4 date siting"><i class="fa-solid fa-ellipsis-vertical"></i> <div class="layer-date">___________</div></span>
                
                </div>
      
                </div>
        </li>
    `;
  }

  document.querySelector(".task-cotainer").innerHTML = cartona;
  statusProsses(allData);
}
//! delete Item
async function deleteItem(id) {
  // console.log(id);

  Swal.fire({
    title: "Are You Sure?",
    text: "You Won't Be Able To Revert This!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Delete It!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      //!code Delete
      showLoding(); //show Loding
      const bodyData = {
        todoId: id,
      };
      const obj = {
        method: "DELETE",
        body: JSON.stringify(bodyData),
        headers: {
          "content-type": "application/json",
        },
      };
      const res = await fetch("https://todos.routemisr.com/api/v1/todos", obj);
      if (res.ok) {
        const da = await res.json();
        if (da.message === "success") {
          Swal.fire({
            title: "Deleted!",
            text: "Your Task Has Been Deleted.",
            icon: "success",
          });

          getAllTodos(); //بنادي عليها علشان لما احزف تعرض ف نفس الوقت هي مكان dsplaydata
          // console.log(da);
        }
      }
      hideLoding(); //hideLoding
    }
  });
}
//! mark Completed
async function markCompleted(id) {
  // console.log(id);

  Swal.fire({
    title: "Are You Sure?",
    text: "You Won't Be Able To Revert This!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Complete It!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      //code
      showLoding(); //show Loding
      const bodyData = {
        todoId: id,
      };
      const obj = {
        method: "PUT",
        body: JSON.stringify(bodyData),
        headers: {
          "content-type": "application/json",
        },
      };
      const res = await fetch("https://todos.routemisr.com/api/v1/todos", obj);

      if (res.ok) {
        const data = await res.json();
        if (data.message === "success") {
          Swal.fire({
            title: "Completed",
            text: "You’re making progress. Stay focused and finish strong.",
            icon: "success",
          });

          getAllTodos();
        }
      }
      hideLoding(); //hideLoding
    }
  });
}
//!show Loding
function showLoding() {
  loding.classList.remove("d-none");
}
//!hide Loding
function hideLoding() {
  loding.classList.add("d-none");
}
//! status Prosses
function statusProsses(allData) {
  // allData   [{},{}]
  const completedDataNumber = allData.filter((e) => e.completed).length;
  const allDataNumber = allData.length;
  document.querySelector(".status-bar .inner .chiled").style.width =
    `${(completedDataNumber / allDataNumber) * 100}%`;
  const statusNumber = document.querySelectorAll(".status-number span"); //[{0},{1}]
  statusNumber[0].innerHTML = completedDataNumber;
  statusNumber[1].innerHTML = allDataNumber;
}
//! show Date
function date(datee) {
    const newDateNumber = new Date(datee);
    const finshDate = newDateNumber.toISOString().split('T')[0];

    const dateElements = document.querySelectorAll(".layer-date");
    dateElements.forEach((e)=> {
        e.innerHTML = finshDate;
    });
}

// async function markCompleted(id){
//     // console.log(id);

//     const bodyData={
//     todoId:id,
// }
// const obj={
//     method:"PUT",
//     body:JSON.stringify(bodyData),
//     headers:{
//         "content-type":"application/json"
//     }
//  }
//  const res=await fetch("https://todos.routemisr.com/api/v1/todos",obj)

// if(res.ok){
//     const data=await res.json()
//             if(data.message==="success"){

//     getAllTodos()
// }
// }

// }

