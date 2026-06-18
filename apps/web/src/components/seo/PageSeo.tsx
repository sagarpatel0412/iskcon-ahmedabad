import { Helmet } from "react-helmet-async";

type Props = {
  title: string;
  description?: string;
};

export default function PageSeo({
  title,
  description,
}: Props) {
  return (
    <Helmet>
      <title>{title}</title>

      {description && (
        <meta
          name="description"
          content={description}
        />
      )}
    </Helmet>
  );
}