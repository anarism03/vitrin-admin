import { Button, Input, Select } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { StatBox } from "./StatBox";

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
    <section className="sticky top-20 z-10 rounded-lg border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur sm:p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-wide text-blue-600">
            Products
          </p>
          <h2 className="m-0 mt-1 text-xl font-semibold text-slate-950">
            Məhsullar
          </h2>
          <p className="m-0 mt-1 text-sm text-slate-500">
            Məhsul siyahısı, yaratma və şəkil idarəetməsi.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:min-w-72">
          <StatBox label="Ümumi" value={totalCount} />
          <StatBox label="Kateqoriyalar" value={categoriesCount} green />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 lg:flex-row">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-slate-400" />}
          placeholder="Ada görə axtar"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          className="lg:!w-64"
        />
        <Select
          allowClear
          showSearch
          placeholder="Kateqoriya"
          value={categoryId}
          options={categoryOptions}
          optionFilterProp="label"
          onChange={onCategoryChange}
          className="lg:!w-64"
        />
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          Yenilə
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          Yeni məhsul
        </Button>
      </div>
    </section>
  );
}
