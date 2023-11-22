import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="w-full bg-gray-100">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative mx-auto flex w-fit justify-center overflow-clip rounded-full">
            <Image src={"/logo.svg"} alt="EUSE logo" width={80} height={80} />
          </div>

          <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500">
            This search engine was create as part of the Information Processing
            and Retrieval class (Processamento e Recuperação de Informação) at
            the Faculty of Engineering, University of Porto (FEUP - Faculdade de
            Engenharia da Universidade do Porto).
          </p>

          <p className="mx-auto mb-2 mt-12 text-center font-bold uppercase text-gray-700">
            Authors{" "}
          </p>

          <ul className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
            <li>
              <p className="text-gray-700 transition hover:text-gray-700/75">
                Ilina Kirovska
              </p>
            </li>

            <li>
              <p className="text-gray-700 transition hover:text-gray-700/75">
                Gonçalo Almeida
              </p>
            </li>

            <li>
              <p className="text-gray-700 transition hover:text-gray-700/75">
                Žan Žlender
              </p>
            </li>
          </ul>

          <p className="mx-auto mt-12 text-center text-sm text-gray-700">
            &copy;2023 All right reserved
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
