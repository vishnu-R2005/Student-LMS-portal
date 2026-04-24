const ProgressBar = ({ value }) => (
  <div className="w-full rounded-full bg-white/20">
    <div
      className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-brand-500"
      style={{ width: `${value}%` }}
    />
  </div>
);

export default ProgressBar;
