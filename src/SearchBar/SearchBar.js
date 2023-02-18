import * as React from "react";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const StyledSearchBox = styled("div")({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledSearchIcon = styled(SearchIcon)({
  color: "rgba(0, 0, 0, 0.54)",
  marginRight: "8px",
});

const StyledInputBase = styled(InputBase)({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: "8px",
    borderRadius: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
});

const SuggestionList = styled("ul")({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  padding: 0,
  margin: 0,
  listStyle: "none",
  backgroundColor: "white",
  border: "1px solid rgba(0, 0, 0, 0.12)",
  borderTop: 0,
  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
});

const SuggestionItem = styled("li")({
  padding: "8px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
});

const ProductCard = styled(Card)({
  top: "100%",
  left: 0,
  right: 0,
  marginTop: "16px",
  transition: "height 2s",
});

const ProductCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px",
});

const ProductImage = styled("img")({
  width: "50%",
  marginBottom: "16px",
});

export default function SearchBox() {
  const [query, setQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState(null);

  const handleQueryChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    // Clear any existing timeouts before creating a new one
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (newQuery.length === 0) {
      setSuggestions([]);
      return;
    }

    // Create a new timeout to fetch suggestions after a delay
    const newTimeoutId = setTimeout(() => {
      fetch(`${process.env.REACT_APP_BASE_URL}/suggestions?q=${newQuery}`)
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(data);
        });
    }, 500); // Delay of 500 milliseconds
    setTimeoutId(newTimeoutId);
  };

  const handleInputFocus = () => {
    setIsExpanded(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsExpanded(false);
    }, 100);
  };

  const handleSuggestionClick = (productID) => {
    setSelectedProduct(null);
    fetch(`${process.env.REACT_APP_BASE_URL}/product/${productID}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedProduct(data);
        setIsExpanded(false);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <StyledSearchBox>
        <StyledSearchIcon />
        <StyledInputBase
          placeholder="Search products..."
          value={query}
          onChange={handleQueryChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        {suggestions.length > 0 && isExpanded && (
          <SuggestionList>
            {suggestions.map((suggestion, index) => (
              <SuggestionItem
                key={suggestion.part_id}
                onClick={() => handleSuggestionClick(suggestion.part_id)}
              >
                {suggestion.partNumber}
              </SuggestionItem>
            ))}
          </SuggestionList>
        )}
      </StyledSearchBox>

      <ProductCard style={{ height: selectedProduct ? "500px" : "0" }}>
        {selectedProduct && (
          <ProductCardContent>
            <ProductImage
              src={`${process.env.REACT_APP_S3URL}/${selectedProduct.fileName}`}
              alt=""
            />
            <div style={{ display: "flex", gap: "5px", fontWeight: "bold" }}>
              <div>Part Number:</div>
              <div>{selectedProduct.partNumber}</div>
            </div>
            <div style={{ display: "flex", gap: "5px", fontWeight: "bold" }}>
              <div>Brand Name:</div>
              <div>{selectedProduct.BrandName}</div>
            </div>
            <div style={{ display: "flex", gap: "5px", fontWeight: "bold" }}>
              <div>Part Terminology Name:</div>
              <div>{selectedProduct.PartTerminologyName}</div>
            </div>
            <div style={{ display: "flex", gap: "5px", fontWeight: "bold" }}>
              <div>Product Category:</div>
              <div>{selectedProduct.categoryName}</div>
            </div>
            <div style={{ display: "flex", gap: "5px", fontWeight: "bold" }}>
              <div>Product Sub-Category:</div>
              <div>{selectedProduct.SubCategoryName}</div>
            </div>
          </ProductCardContent>
        )}
      </ProductCard>
    </div>
  );
}
