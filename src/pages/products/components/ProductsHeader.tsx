import { Button, Input, Select } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

type CategoryOption = {
  value: string;
  label: string;
};

type ProductsHeaderProps = {
  categoryId: string | undefined;
  categoryOptions: CategoryOption[];
  categoriesCount: number;
  onCreate: () => void;
  onRefresh: () => void;
  onCategoryChange: (value?: string) => void;
  onSearchChange: (value: string) => void;
  searchText: string;
  totalCount: number;
};

export function ProductsHeader({
  categoryId,
  categoryOptions,
  categoriesCount,
  onCreate,
  onRefresh,
  onCategoryChange,
  onSearchChange,
  searchText,
  totalCount,
}: ProductsHeaderProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="m-0 text-xl font-semibold text-slate-950">Məhsullar</h2>
          <p className="m-0 mt-1 text-sm text-slate-500">
            Siyahı, yaratma, redaktə və silmə əməliyyatları.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-slate-500 sm:flex sm:gap-4">
          <span className="rounded-lg bg-slate-50 px-3 py-2 sm:bg-transparent sm:p-0">
            Ümumi: <b className="text-slate-900">{totalCount}</b>
          </span>
          <span className="rounded-lg bg-slate-50 px-3 py-2 sm:bg-transparent sm:p-0">
            Kateqoriya: <b className="text-slate-900">{categoriesCount}</b>
          </span>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:flex lg:flex-row">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-slate-400" />}
          placeholder="Ada görə axtar"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          className="!w-full lg:!w-64"
        />
        <Select
          allowClear
          showSearch
          placeholder="Kateqoriya"
          value={categoryId}
          options={categoryOptions}
          optionFilterProp="label"
          onChange={onCategoryChange}
          className="!w-full lg:!w-64"
        />
        <Button
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          className="!w-full lg:!w-auto"
        >
          Yenilə
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreate}
          className="!w-full lg:!w-auto"
        >
          Yeni məhsul
        </Button>
      </div>
    </section>
  );
}
