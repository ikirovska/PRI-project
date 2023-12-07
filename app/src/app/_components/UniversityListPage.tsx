import React, { useState, useEffect } from 'react';
import {api} from "~/trpc/react";

const paginate = (array, pageSize, pageNumber) => {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};

const UniversityListPage = ({ universities }) => {
    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedUniversities, setDisplayedUniversities] = useState([]);
    const [relevantMap, setRelevantMap] = useState({});

    useEffect(() => {
        setDisplayedUniversities(paginate(universities, pageSize, currentPage));
    }, [universities, currentPage]);

    const totalPages = Math.ceil(universities.length / pageSize);

    const handlePageChange = (newPage) => {
        const clampedPage = Math.min(Math.max(newPage, 1), totalPages);
        setCurrentPage(clampedPage);
    };

    const handleRelevanceChange = (universityId, isRelevant) => {
        setRelevantMap((prevMap) => ({
            ...prevMap,
            [universityId]: isRelevant,
        }));
    };

    const handleSaveRelevance = async () => {
        // Use Promise.all to wait for all async calls to complete
        await Promise.all(Object.entries(relevantMap).map(async ([universityId, isRelevant]) => {
            if (isRelevant) {
                try {
                    // Chama o procedimento para atualizar a relevância no Solr
                    await api.universities.updateRelevance({ universityId, isRelevant });
                    console.log(`Relevância da universidade ${universityId} atualizada com sucesso.`);
                } catch (error) {
                    console.error(`Erro ao atualizar a relevância da universidade ${universityId}.`, error);
                }
            }
        }));
    };

    return (
        <div>
            <h1>Lista de Universidades</h1>

            <ul>
                {displayedUniversities.map((university) => (
                    <li key={university.name}>
                        <input
                            type="checkbox"
                            checked={relevantMap[university.id] || false}
                            onChange={(e) => handleRelevanceChange(university.id, e.target.checked)}
                        />
                        {university.name}
                    </li>
                ))}
            </ul>

            <div>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Próxima
                </button>
                <button onClick={handleSaveRelevance}>Salvar Relevância</button>
            </div>
        </div>
    );
};

export default UniversityListPage;