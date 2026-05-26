import { Button, Result, Space } from "antd";
import { HomeOutlined, RollbackOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type ErrorPageProps = {
  status?: "403" | "404" | "500";
  title?: string;
  subTitle?: string;
};

export default function ErrorPage({
  status = "404",
  title = "Sehife tapilmadi",
  subTitle = "Axtardiginiz sehife movcud deyil ve ya unvan deyisib.",
}: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={
          <Space wrap>
            <Button
              icon={<RollbackOutlined />}
              onClick={() => navigate(-1)}
            >
              Geri qayit
            </Button>
            <Button
              type="primary"
              icon={<HomeOutlined />}
              onClick={() => navigate("/", { replace: true })}
            >
              Ana sehife
            </Button>
          </Space>
        }
      />
    </div>
  );
}
