import React, { useState } from "react";
import { Item } from "../../../pages/Home/Home";
import styles from "./Table.module.scss";

interface TableProps {
  items: Item[];
  onSort: (key: keyof Item) => void;
  sortConfig: { key: keyof Item; direction: "asc" | "desc" } | null;
  onPriceUpdate: (itemId: number, newPrice: number) => void;
  userRole: "editor" | "viewer";
}

const Table: React.FC<TableProps> = ({
  items,
  onSort,
  sortConfig,
  onPriceUpdate,
  userRole,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getSortIcon = (columnKey: keyof Item) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <span className={styles.sortIcon}>↕️</span>;
    }
    return sortConfig.direction === "asc" ? (
      <span className={styles.sortIconActive}>↑</span>
    ) : (
      <span className={styles.sortIconActive}>↓</span>
    );
  };

  const handleEditStart = (item: Item) => {
    if (userRole === "editor") {
      setEditingId(item.id);
      setEditPrice(item.price.toString());
    }
  };

  const handleEditSave = () => {
    if (editingId && editPrice) {
      const newPrice = parseFloat(editPrice);
      if (!isNaN(newPrice) && newPrice >= 0) {
        onPriceUpdate(editingId, newPrice);
      }
    }
    setEditingId(null);
    setEditPrice("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditPrice("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th} onClick={() => onSort("name")}>
              <div className={styles.thContent}>
                Item Name
                {getSortIcon("name")}
              </div>
            </th>
            <th className={styles.th} onClick={() => onSort("size")}>
              <div className={styles.thContent}>
                Item Size
                {getSortIcon("size")}
              </div>
            </th>
            <th className={styles.th} onClick={() => onSort("price")}>
              <div className={styles.thContent}>
                Item Price
                {getSortIcon("price")}
              </div>
            </th>
            <th className={styles.th} onClick={() => onSort("createdAt")}>
              <div className={styles.thContent}>
                Creation Date
                {getSortIcon("createdAt")}
              </div>
            </th>
          </tr>
        </thead>

        <tbody className={styles.tbody}>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.noData}>
                No items found
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.td}>
                  <span className={styles.itemName}>{item.name}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.itemSize}>{item.size}</span>
                </td>
                <td className={styles.td}>
                  {editingId === item.id ? (
                    <div className={styles.priceEdit}>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className={styles.priceInput}
                        autoFocus
                        step="0.01"
                        min="0"
                      />
                      <button
                        onClick={handleEditSave}
                        className={styles.saveBtn}
                        title="Save"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className={styles.cancelBtn}
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className={styles.priceDisplay}>
                      <span>{formatPrice(item.price)}</span>
                      {userRole === "editor" && (
                        <button
                          onClick={() => handleEditStart(item)}
                          className={styles.editBtn}
                          title="Edit price"
                        >
                          Edit Price
                        </button>
                      )}
                    </div>
                  )}
                </td>
                <td className={styles.td}>
                  <span className={styles.date}>
                    {formatDate(item.createdAt)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
