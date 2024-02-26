import { useEffect } from "react";

const useOutsideClick = (
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleOutsideClick = (e: any) => {
    if (visible && e.target.closest(".popup") === null) {
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
};

export default useOutsideClick;
