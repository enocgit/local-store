"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subHours, subDays, isAfter } from "date-fns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  filters,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [dateFilter, setDateFilter] = React.useState("all");

  const handleFilterChange = (columnId: string, value: string) => {
    setColumnFilters((prev) => {
      if (value === "ALL") {
        return prev.filter((filter) => filter.id !== columnId);
      }

      const existing = prev.findIndex((filter) => filter.id === columnId);
      if (existing !== -1) {
        const newFilters = [...prev];
        newFilters[existing] = { id: columnId, value };
        return newFilters;
      }
      return [...prev, { id: columnId, value }];
    });
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  // Filter data based on date range
  const filteredData = React.useMemo(() => {
    if (dateFilter === "all") return data;

    const now = new Date();
    const filterDate = {
      "24h": subHours(now, 24),
      "7d": subDays(now, 7),
      "30d": subDays(now, 30),
    }[dateFilter];

    if (!filterDate) return data;

    return data.filter((item: any) => {
      const itemDate = new Date(item.createdAt);
      return isAfter(itemDate, filterDate);
    });
  }, [data, dateFilter]);

  return (
    <div>
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Search"
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {filters?.map((filter) => (
          <div key={filter.columnId} className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filter.title}:
            </span>
            <Select
              key={filter.columnId}
              onValueChange={(value) =>
                handleFilterChange(filter.columnId, value)
              }
              value={
                (columnFilters.find((f) => f.id === filter.columnId)
                  ?.value as string) || "ALL"
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={filter.title} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
