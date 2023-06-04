/** @format */

import * as React from "react";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const columns = [
   columnHelper.accessor("name", {
      header: "Name",
      cell: (cell) => <span className="cell-value">{cell.getValue()}</span>,
   }),
   columnHelper.accessor("image", {
      header: "Image",
      cell: (cell) => (
         <img
            className="cell-image"
            src={cell.getValue()}
         />
      ),
   }),
   columnHelper.accessor("category", {
      header: "Category",
      cell: (cell) => <span className="cell-value">{cell.getValue()}</span>,
   }),
   columnHelper.accessor("label", {
      header: "Label",
      cell: (cell) => <span className="cell-value">{cell.getValue()}</span>,
   }),
   columnHelper.accessor("price", {
      header: "Price",
      cell: (cell) => <span className="cell-value">₹ {cell.getValue()}</span>,
   }),
   columnHelper.accessor("description", {
      header: "Description",
      cell: (cell) => <span className="cell-description">{cell.getValue()}</span>,
   }),
];

export default function Table() {
   const [defaultData, setDefaultData] = React.useState([]);
   const [data, setData] = React.useState(() => [...defaultData]);
   const [categories, setCategories] = React.useState([]);
   const rerender = React.useReducer(() => ({}), {})[1];
   const [isClick, setClick] = React.useState(false);

   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
   });
   const getData = async () => {
      const response = await fetch("https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json");
      const data = await response.json();
      return data;
   };
   const sortedData = (value) => {
      if (value == "ascending") {
         table.getSortedRowModel().rows.sort((a, b) => a.getVisibleCells()[0].getValue().localeCompare(b.getVisibleCells()[0].getValue()));
      } else if (value == "descending") {
         table.getSortedRowModel().rows.sort((a, b) => b.getVisibleCells()[0].getValue().localeCompare(a.getVisibleCells()[0].getValue()));
      } else if ("None") {
         setData([...defaultData]);
      }
   };
   const getCategories = () => {
      let temp = [];
      defaultData?.forEach((item) => {
         if (!temp.includes(item?.category)) {
            temp.push(item?.category);
         }
      });
      setCategories(temp);
   };
   React.useEffect(() => {
      getData().then((data) => {
         setDefaultData(data);
         setData(data);
         getCategories();
      });
   }, []);

   const filterByCategory = (value) => {
      if (value == "All") {
         setData([...defaultData]);
      } else {
         setData(defaultData.filter((item) => item.category == value));
      }
   };

   return (
      <div>
         <h2>RECIPE TABLE</h2>
         <table className="custom-table">
            <thead>
               {table.getHeaderGroups().map((headerGroup) => (
                  <>
                     <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                           <th key={header.id}>
                              <div className="th-head">
                                 <div className="table-head">{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</div>
                                 <span
                                    style={{
                                       width: "fit-content",
                                    }}>
                                    {header.index == 1 || header.index == 4 ? (
                                       <select
                                          style={{
                                             width: "fit-content",
                                          }}
                                          defaultValue={"None"}
                                          onChange={(event) => {
                                             sortedData(event.target.value);
                                             rerender();
                                          }}>
                                          <option value="None">None</option>
                                          <option value="ascending">Ascending</option>
                                          <option value="descending">Descending</option>
                                       </select>
                                    ) : header.index == 2 ? (
                                       <select
                                          style={{
                                             width: "fit-content",
                                          }}
                                          defaultValue={"None"}
                                          onChange={(event) => {
                                             filterByCategory(event.target.value);
                                          }}>
                                          <option value="All">All</option>

                                          {categories?.map((item) => {
                                             return (
                                                <>
                                                   <option value={item}>{item}</option>;
                                                </>
                                             );
                                          })}
                                       </select>
                                    ) : null}
                                 </span>
                              </div>
                           </th>
                        ))}
                     </tr>
                  </>
               ))}
            </thead>
            <tbody>
               {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                     {row.getVisibleCells().map((cell) => {
                        if (cell.column.columnDef.header === "Price") {
                           return (
                              <td
                                 key={cell.id}
                                 onDoubleClick={() => {
                                    setClick(!isClick);
                                 }}>
                                 {!isClick ? flexRender(cell.column.columnDef.cell, cell.getContext()) : <input defaultValue={cell.getValue()} />}
                              </td>
                           );
                        } else {
                           return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
                        }
                     })}
                  </tr>
               ))}
            </tbody>
            {/* <tfoot>
               {table.getFooterGroups().map((footerGroup) => (
                  <tr key={footerGroup.id}>
                     {footerGroup.headers.map((header) => (
                        <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}</th>
                     ))}
                  </tr>
               ))}
            </tfoot> */}
         </table>
         <div
            style={{
               display: "flex",
               alignItems: "center",
               gap: "30px",
               width: "fit-content",
            }}
            className="h-4"
         />
         <button
            className="border p-2"
            onClick={() => {
               setClick(false);
            }}>
            Save
         </button>
         <button
            className="border p-2"
            onClick={() => {
               setClick(false);
            }}>
            Reset
         </button>
      </div>
   );
}
