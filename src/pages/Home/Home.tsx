import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import SearchBar from "../../components/common/SearchBar/SearchBar";
import Table from "../../components/common/Table/Table";
import itemsData from "../../data/items.json";
import styles from "./Home.module.scss";

// Define the type for our items
export interface Item {
  id: number;
  name: string;
  size: string;
  price: number;
  createdAt: string;
}

// Define sort configuration type
type SortConfig = {
  key: keyof Item;
  direction: "asc" | "desc";
} | null;

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<Item[]>(itemsData.items);

  const [searchTerm, setSearchTerm] = useState("");

  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = (key: keyof Item) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const handlePriceUpdate = (itemId: number, newPrice: number) => {
    if (currentUser?.role === "editor") {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, price: newPrice } : item
        )
      );
    }
  };

  const processedItems = useMemo(() => {
    let filteredItems = [...items];

    if (searchTerm) {
      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig) {
      filteredItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredItems;
  }, [items, searchTerm, sortConfig]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.homePage}>
      <Header
        userName={currentUser.name}
        userRole={currentUser.role}
        onLogout={handleLogout}
      />

      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Inventory Management</h1>
          <p className={styles.pageSubtitle}>
            {processedItems.length} items found
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        <div className={styles.controls}>
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search items by name..."
          />
        </div>

        <div className={styles.tableContainer}>
          <Table
            items={processedItems}
            onSort={handleSort}
            sortConfig={sortConfig}
            onPriceUpdate={handlePriceUpdate}
            userRole={currentUser.role}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
