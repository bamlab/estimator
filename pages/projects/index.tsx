import React, { useMemo, useState } from "react";
import styled from "@emotion/styled";
import Select from "react-select";
import { Project } from "@prisma/client";
import {
  Button,
  Col,
  Container,
  Input,
  Spacer,
  Text,
  Dropdown,
  useInput } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { ROOT_URL } from "../../src/constants";
import { toast } from "react-toastify";
import wretch from "wretch";
import { GetServerSideProps } from "next";
import { HelperText } from "../../src/modules/version/components/HelperText";

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch(`${ROOT_URL}/projects`).then((res) =>
    res.json()
  );

  return {
    props: { projects: response.projects },
  };
};

type Props = { projects: Project[] };

export default function ProjectsPage({ projects }: Props) {
  const [projectId, setProjectId] = useState("");
  const router = useRouter();
  const { bindings: projectNameBindings, value: projectName } = useInput("");
  const { bindings: startDateBindings, value: startDate } = useInput("");
  const { bindings: endDateBindings, value: endDate } = useInput("");
  const [unit, setUnit] = useState(new Set(["Select"]));
  const { bindings: productivityBindings, value: productivity } = useInput("");
  const [errorMessage, setErrorMessage] = useState("");
  const initFields = {"projectName" : false, "startDate" : false, "endDate" : false, "unit" : false, "productivity" : false}
  const [missingFields, setMissingFields] = useState(initFields);

  const createNewProject = async () => {
    if (!projectName || !startDate || !endDate || (Array.from(unit)[0] === "Select") || !productivity) {
      const input = {
        "projectName" : !projectName,
        "startDate" : !startDate,
        "endDate" : !endDate,
        "unit" : (Array.from(unit)[0] === "Select"),
        "productivity" : !productivity
      }
      setErrorMessage("Please complete all fields");
      setMissingFields(input);

      return;
    }
    const response = await wretch(`${ROOT_URL}/projects`)
      .post({
        name: projectName,
        startDate,
        endDate,
        unit: unit.keys.toString(),
        productivity,
      })
      .json();

    if (response.project) {
      toast("Super ! C'est parti pour une nouvelle aventure 🚀");
      router.push(`/projects/${response.project.id}/ressources`);
    }
  };

  const options = useMemo(
    () =>
      projects
        ? projects.map((project) => ({
            value: project.id,
            label: project.name,
          }))
        : [],
    [projects]
  );

  // `onClick`, `href`, and `ref` need to be passed to the DOM element
  // for proper handling
  // const LinkButton = React.forwardRef(({ onClick, href }, ref) => {
  //   return (
  //     <a href={href} onClick={onClick} ref={ref}>
  //       <Button disabled={projectId === ""} style={{ zIndex: 0 }}>
  //           {"C'est parti !"}
  //       </Button>
  //     </a>
  //   )
  // })
  // LinkButton.displayName = 'LinkButton'

  return (
    <Container>
      <Col>
        <Header>
          <h1>Les Projets M33</h1>
        </Header>

        <h2>Choisir un projet</h2>
        <Select
          options={options}
          onChange={(option) => {
            if (option) {
              setProjectId(option.value);
            }
          }}
        />
        <Spacer y={1} />
        <Link
          href={`/projects/${projectId}/versions`}
          passHref>
            <Button disabled={projectId === ""} style={{ zIndex: 0 }}>
              {"C'est parti !"}
            </Button>
        </Link>
        <Spacer y={2} />
        <h2>Créer un projet</h2>

        <Col>
          <Input
            label="Nom du projet"
            placeholder="Yomoni"
            type="text"
            {...projectNameBindings}
            status={missingFields.projectName ? "error" : "default"}
          />
          <Spacer x={3} />
          <Input
            label="Date de début"
            placeholder="28/04/2022"
            type="date"
            {...startDateBindings}
            status={missingFields.startDate ? "error" : "default"}
          />
          <Spacer x={3} />
          <Input
            label="Date de fin"
            placeholder="28/04/2022"
            type="date"
            {...endDateBindings}
            status={missingFields.endDate ? "error" : "default"}
          />
          <Spacer x={3} />
          <Text 
            color= {missingFields.unit ? "#F31260" : "black"}
            css = {labelText}>
              Unité (ticket ou points)</Text>
          {/* <div style={{ width: 200 }}> */}
            <Dropdown>
              <Dropdown.Button 
                css={missingFields.unit ? errorDropdown : defaultDropdown}
                flat>{unit}
              </Dropdown.Button>
              <Dropdown.Menu 
                  aria-label="Static Actions"
                  disallowEmptySelection
                  selectionMode = "single"
                  selectedKeys={unit}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore https://nextui.org/docs/components/dropdown#command
                  onSelectionChange={setUnit}
                  >
                <Dropdown.Item key="Tickets">Tickets</Dropdown.Item>
                <Dropdown.Item key="Points">Points</Dropdown.Item>
               </Dropdown.Menu>
            </Dropdown>
          {/* </div> */}
          <Spacer x={3} />
          <Input
            label="Productivité initiale (/jour/dev)"
            placeholder="1"
            type="number"
            {...productivityBindings}
            color={missingFields.productivity ? "error" : "default"}
            status={missingFields.productivity ? "error" : "default"}
          />
          <Spacer x={3} />
          { errorMessage && <HelperText
            color={"secondary"}
            text={"Tous les champs sont requis"}
          /> }
          <Button onClick={createNewProject} color={"success"}>
            Créer un nouveau projet
          </Button>
          <Spacer x={3} />
        </Col>
      </Col>
    </Container>
  );
}

const Header = styled.div`
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
`;

const defaultDropdown = {
  background: "#ECEEF0",
  color: "black",
  "font-weight": "normal"
}

const errorDropdown = {
  background: "#FDD8E5",
  color: "#F31260"
}

const labelText = {
  fontSize: '14px',
  padding: '$1 $2',
}