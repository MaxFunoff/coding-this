import { FC } from "react";

interface HeartIconProps {
    active?: boolean
}

export const HeartIcon: FC<HeartIconProps> = ({active = false}) => {
  return (
    <div style={{width: '100%'}}>
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        enableBackground="0 0 512 512"
      >
        <path
          fill={active ? "#FF757C" : "#C8C8C8"}
          d="M365.109,54.603c-44.572,0-84.156,21.337-109.109,54.35c-24.953-33.012-64.538-54.35-109.109-54.35
                c-75.492,0-136.692,61.199-136.692,136.693c0,95.888,83.741,156.115,129.949,190.633c57.242,42.76,52.644,38.401,115.852,75.467
                c63.206-37.066,58.609-32.706,115.852-75.467c46.209-34.518,129.949-94.746,129.949-190.633
                C501.801,115.803,440.602,54.603,365.109,54.603z"
        />

        <path
         fill="#1D1D1D"
          d="M256,467.595c-1.784,0-3.567-0.467-5.16-1.401c-9.542-5.595-17.538-10.246-24.432-14.256
                    c-39.207-22.805-43.305-25.189-92.364-61.837l-3.208-2.394c-23.647-17.637-56.031-41.793-82.64-73.702
                    C16.216,275.653,0,234.367,0,191.296C0,110.3,65.895,44.405,146.891,44.405c42.168,0,81.27,17.539,109.109,48.529
                    c27.839-30.99,66.94-48.529,109.109-48.529C446.105,44.405,512,110.3,512,191.296c0,43.071-16.216,84.356-48.197,122.709
                    c-26.609,31.91-58.994,56.065-82.64,73.703l-3.208,2.394c-49.059,36.648-53.157,39.031-92.364,61.837
                    c-6.895,4.01-14.89,8.661-24.432,14.256C259.567,467.128,257.784,467.595,256,467.595z M146.891,64.804
                    c-69.748,0-126.493,56.744-126.493,126.493c0,88.588,76.768,145.849,122.635,180.06l3.22,2.402
                    c48.12,35.946,52.122,38.274,90.412,60.546c5.631,3.276,11.996,6.978,19.336,11.271c7.338-4.293,13.704-7.995,19.336-11.271
                    c38.29-22.272,42.292-24.6,90.412-60.546l3.22-2.402c45.865-34.211,122.633-91.472,122.633-180.06
                    c0-69.748-56.744-126.493-126.493-126.493c-40.007,0-76.81,18.334-100.972,50.299c-1.928,2.55-4.939,4.049-8.137,4.049
                    c-3.197,0-6.208-1.499-8.137-4.049C223.701,83.137,186.898,64.804,146.891,64.804z"
        />
       
      </svg>
    </div>
  );
};
