import { useLocalSearchParams } from "expo-router";
import React from "react";
import MenuItemForm from "../../components/admin/MenuItemForm";
import { useAdminStore } from "../../store/adminStore";

export default function EditMenuItem() {
  const { id } = useLocalSearchParams();
  const { menu } = useAdminStore();
  const menuItem = menu.find((item) => item.id === id);

  return <MenuItemForm editItem={menuItem} />;
}
