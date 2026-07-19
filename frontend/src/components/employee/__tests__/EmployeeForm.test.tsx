import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import EmployeeForm from "../EmployeeForm";
import userEvent from "@testing-library/user-event";


const mockNavigate = jest.fn();
const mockToast = jest.fn();


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
}));


jest.mock(
  "../../../hooks/usePermissions",
  () => ({
    usePermissions: () => ({
      canCreate: true,
      canEdit: true,
      isEmployee: false,
      role: "super_admin",
    }),
  })
);


jest.mock(
  "../../../components/ui/Toast",
  () => ({
    useToast: () => ({
      toast: mockToast,
    }),
  })
);


jest.mock(
  "../../../store/auth.store",
  () => ({
    useAuthStore: (selector: any) =>
      selector({
        user: {
          id: "1",
          employee: "1",
          role: "super_admin",
        },
      }),
  })
);


jest.mock(
  "../../../services/employee.services",
  () => ({
    employeeService: {
      list: jest.fn()
        .mockResolvedValue({
          data: [],
        }),

      create: jest.fn()
        .mockResolvedValue({
          id: "123",
        }),

      update: jest.fn(),

      get: jest.fn(),
    },
  })
);



const fillRequiredFields = () => {

  fireEvent.change(
    document.querySelector("#employeeId")!,
    {
      target: {
        value: "EMP100",
      },
    }
  );


  fireEvent.change(
    document.querySelector("#name")!,
    {
      target: {
        value: "John Doe",
      },
    }
  );


  fireEvent.change(
    document.querySelector("#email")!,
    {
      target: {
        value: "john@test.com",
      },
    }
  );


  fireEvent.change(
    document.querySelector("#phone")!,
    {
      target: {
        value: "9876543210",
      },
    }
  );


  fireEvent.change(
    document.querySelector("#department")!,
    {
      target: {
        value: "Engineering",
      },
    }
  );


  fireEvent.change(
    document.querySelector("#designation")!,
    {
      target: {
        value: "Developer",
      },
    }
  );


  fireEvent.change(
    document.querySelector(
      'input[type="number"]'
    )!,
    {
      target: {
        value: "50000",
      },
    }
  );


  fireEvent.change(
    document.querySelector("#joiningDate")!,
    {
      target: {
        value: "2025-01-01",
      },
    }
  );

};



describe(
  "EmployeeForm",
  () => {


    beforeEach(() => {
      jest.clearAllMocks();
    });



    test(
      "renders create employee form",
   async () => {

        render(
          <MemoryRouter>
            <EmployeeForm />
          </MemoryRouter>
        );


        expect(
          screen.getByText(
            /Add Employee/i
          )
        )
          .toBeInTheDocument();


        expect(
          screen.getByText(
            /Employee ID/i
          )
        )
          .toBeInTheDocument();


        expect(
          screen.getByText(
            /Full Name/i
          )
        )
          .toBeInTheDocument();


        expect(
          screen.getByText(
            /Email/i
          )
        )
          .toBeInTheDocument();

      }
    );





    test(
      "shows validation errors",
      async () => {

        render(
          <MemoryRouter>
            <EmployeeForm />
          </MemoryRouter>
        );


        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: /Create Employee/i,
            }
          )
        );


        expect(
          await screen.findByText(
            "Employee ID is required"
          )
        )
          .toBeInTheDocument();


        expect(
          screen.getByText(
            "Name is required"
          )
        )
          .toBeInTheDocument();


        expect(
          screen.getByText(
            "Email is required"
          )
        )
          .toBeInTheDocument();


        expect(
          screen.getByText(
            "Phone is required"
          )
        )
          .toBeInTheDocument();


        expect(
          screen.getByText(
            "Department is required"
          )
        )
          .toBeInTheDocument();


        expect(
          screen.getByText(
            "Designation is required"
          )
        )
          .toBeInTheDocument();


        expect(
          screen.getByText(
            "Valid salary required"
          )
        )
          .toBeInTheDocument();


        expect(
          screen.getByText(
            "Joining date is required"
          )
        )
          .toBeInTheDocument();

      }
    );






    test(
      "accepts valid input",
      async () => {

        render(
          <MemoryRouter>
            <EmployeeForm />
          </MemoryRouter>
        );


        fillRequiredFields();



        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: /Create Employee/i,
            }
          )
        );



        await waitFor(
          () => {

            expect(
              screen.queryByText(
                "Name is required"
              )
            )
              .not
              .toBeInTheDocument();


          }
        );

      }
    );
    test(
      "invalid email validation",
      async () => {
        const user = userEvent.setup();

        render(
          <MemoryRouter>
            <EmployeeForm />
          </MemoryRouter>
        );

        const email =
          screen.getByLabelText(
            /Email/i
          ) as HTMLInputElement;


        await user.clear(email);

        await user.type(
          email,
          "wrong-email"
        );


        expect(email.value)
          .toBe("wrong-email");


        await user.click(
          screen.getByRole(
            "button",
            {
              name: /Create Employee/i,
            }
          )
        );
        expect(
          await screen.findByText(
            /email/i
          )
        ).toBeInTheDocument();
      }
    );
    test(
      "invalid phone validation",
      async () => {


        render(
          <MemoryRouter>
            <EmployeeForm />
          </MemoryRouter>
        )

        fillRequiredFields();



        fireEvent.change(
          document.querySelector("#phone")!,
          {
            target: {
              value: "12",
            },
          }
        );



        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: /Create Employee/i,
            }
          )
        );



        expect(
          await screen.findByText(
            "Invalid phone"
          )
        )
          .toBeInTheDocument();


      }
    );


  }
);