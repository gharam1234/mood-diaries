import InputTest from "@/commons/components/input/test";
import PaginationTest from "@/commons/components/pagination/test";
import ButtonTest from "@/commons/components/button/test";
import SearchBarTest from "@/commons/components/searchbar/test";
import SelectBoxTest from "@/commons/components/selectbox/test";
import ToggleTest from "@/commons/components/toggle/test";

export default function Home() {
  return (
    <div>
      <PaginationTest />
      <div style={{ margin: '40px 0', borderTop: '2px solid #e0e0e0' }} />
      <InputTest />
      <ButtonTest />
      <SearchBarTest />
      <SelectBoxTest />
      <ToggleTest />
      
      
      
    </div>
  );
}