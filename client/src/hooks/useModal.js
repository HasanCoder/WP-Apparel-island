import { useState } from "react";

export const useModal = _ => {
   const [modalOpen, setModalOpen] = useState(false);



   const toggle = _ => {
      document.body.classList.toggle("modal-active");
      setModalOpen(!modalOpen);
   };



   return [modalOpen, toggle];
};
