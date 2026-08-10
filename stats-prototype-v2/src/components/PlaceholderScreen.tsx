export default function PlaceholderScreen({ title }: { title: string }) {
  return (
    <div className="screen">
      <div className="placeholder">
        <div className="placeholder__icon">＋</div>
        <div className="placeholder__title">{title}</div>
        <div className="placeholder__text">메뉴만 준비된 화면입니다. 상세 내용은 추후 개발 예정입니다.</div>
      </div>
    </div>
  );
}
