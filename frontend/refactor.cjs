const fs = require('fs');
let content = fs.readFileSync('src/components/DataTable.jsx', 'utf8');

content = content.replace(
    'import React, { useState, useMemo } from "react";',
    'import React, { useState, useMemo, useEffect } from "react";\nimport { getDatasetRecords } from "../services/api";'
);

const signature_old = `export default function DataTable({ dataset = [], onInspectSource, onExportClick, onChatClick, onReportClick }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortField, setSortField] = useState("confidence");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // Extract distinct categories for filter
  const categories = useMemo(() => {
    const set = new Set(dataset.map((d) => d.category).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [dataset]);`;

const signature_new = `export default function DataTable({ dataset = [], datasetId, onInspectSource, onExportClick, onChatClick, onReportClick }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortField, setSortField] = useState("confidence");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // Server-side State
  const [serverRecords, setServerRecords] = useState([]);
  const [serverTotal, setServerTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch from server if datasetId is provided
  useEffect(() => {
    if (!datasetId) return;
    const fetchRecords = async () => {
      setIsLoading(true);
      try {
        const data = await getDatasetRecords(datasetId, {
          page: currentPage,
          limit: rowsPerPage,
          search: searchQuery,
          category: selectedCategory,
          sortField,
          sortOrder,
        });
        setServerRecords(data.records || []);
        setServerTotal(data.total || 0);
      } catch (e) {
        console.error("Failed to fetch records", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecords();
  }, [datasetId, currentPage, searchQuery, selectedCategory, sortField, sortOrder, rowsPerPage]);

  const activeDataset = datasetId ? serverRecords : dataset;

  // Extract distinct categories for filter
  const categories = useMemo(() => {
    const sourceData = datasetId ? serverRecords : dataset;
    const set = new Set(sourceData.map((d) => d.category).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [dataset, datasetId, serverRecords]);`;

content = content.replace(signature_old, signature_new);

const filtering_old = `  // Filtering and Searching
  const filteredData = useMemo(() => {
    return dataset.filter((item) => {`;
const filtering_new = `  // Filtering and Searching
  const filteredData = useMemo(() => {
    if (datasetId) return activeDataset;
    return activeDataset.filter((item) => {`;
content = content.replace(filtering_old, filtering_new);

const sorting_old = `  // Sorting
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {`;
const sorting_new = `  // Sorting
  const sortedData = useMemo(() => {
    if (datasetId) return filteredData;
    return [...filteredData].sort((a, b) => {`;
content = content.replace(sorting_old, sorting_new);

const pagination_old = `  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage]);`;
const pagination_new = `  // Pagination
  const totalRecords = datasetId ? serverTotal : sortedData.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    if (datasetId) return sortedData;
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, datasetId, serverTotal]);`;
content = content.replace(pagination_old, pagination_new);

const if_old = `  if (!dataset || dataset.length === 0) {`;
const if_new = `  if ((!activeDataset || activeDataset.length === 0) && !isLoading && !datasetId) {`;
content = content.replace(if_old, if_new);

const count_old = `Showing <strong>{paginatedData.length}</strong> of <strong>{filteredData.length}</strong> items`;
const count_new = `Showing <strong>{paginatedData.length}</strong> of <strong>{totalRecords}</strong> items`;
content = content.replace(count_old, count_new);

fs.writeFileSync('src/components/DataTable.jsx', content);
console.log('Done refactoring!');
