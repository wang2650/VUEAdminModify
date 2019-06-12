var storage={
    set(key,value){
        localStorage.setItem(key,value)
    },
    getValue(key){
      return  localStorage.getItem(key)
    },
    remove(key){
        localStorage.removeItem(key)
    },
    clear(){
        localStorage.clear()
    }

}
export  default storage